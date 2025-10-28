const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly check if model already exists to prevent overwriting
if (mongoose.models.User) {
  mongoose.deleteModel('User');
}

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: function() { return this.role === 'seeker'; } 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,  // Ensure emails are stored in lowercase
    trim: true,       // Trim whitespace
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: { 
    type: String, 
    required: true,
    select: false  // Never return passwordHash in queries by default
  },
  role: { 
    type: String, 
    enum: ['employer', 'seeker'], 
    required: true 
  },
  companyName: { 
    type: String,
    required: function() { return this.role === 'employer'; }
  },
  companyEmail: { 
    type: String,
    required: function() { return this.role === 'employer'; },
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid company email']
  },
  companyWebsite: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  }
}, { 
  timestamps: true,
  collection: 'users' // Explicit collection name
});

// Password hashing middleware - ONLY hash if the field is modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Virtual for plain password (not stored in DB)
userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.passwordHash = password; // Will be hashed in pre-save hook
  })
  .get(function() {
    return this._password;
  });

// Export the model
module.exports = mongoose.models.User || mongoose.model('User', userSchema);