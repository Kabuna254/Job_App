const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for Job
exports.applyForJob = async (req, res) => {
  try {
    const application = await Application.create({
      job: req.body.jobId,
      applicant: req.user._id,
      ...req.body
    });
    
    // Add to job's applications array
    await Job.findByIdAndUpdate(req.body.jobId, {
      $push: { applications: application._id }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ message: 'Application failed' });
  }
};

// Get User's Applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company');
    res.json(applications);
  } catch (error) {
    console.error('Get My Apps Error:', error);
    res.status(500).json({ message: 'Failed to get applications' });
  }
};

// Get Applications for Job (Employer)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Verify employer owns the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email');
    res.json(applications);
  } catch (error) {
    console.error('Get Job Apps Error:', error);
    res.status(500).json({ message: 'Failed to get applications' });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('job', 'postedBy');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isApplicant = application.applicant.toString() === req.user._id.toString();
    const isEmployer = application.job.postedBy.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove from job's applications array
    await Job.findByIdAndUpdate(application.job._id, {
      $pull: { applications: application._id }
    });

    await application.deleteOne();
    res.json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};