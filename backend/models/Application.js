const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  applicantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resumeLink: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: ['Submitted', 'Reviewed', 'Rejected', 'Accepted'], 
    default: 'Submitted' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Application', applicationSchema);
