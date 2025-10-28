const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Remote'],
    required: true
  },
  status: { 
    type: String, 
    enum: ['Open', 'Closed'],
    default: 'Open' 
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });  // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Job', jobSchema);
