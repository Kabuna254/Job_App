const Job = require('../models/Job');

// Get All Jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// Get Job by ID (Public)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

// Create a Job (Employer Only)
exports.createJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can create jobs.' });
  }

  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    console.error('Job Creation Error:', error.message);
    res.status(500).json({ message: 'Job creation failed' });
  }
};

// Update Job (Employer Only)
exports.updateJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can update jobs.' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this job.' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job' });
  }
};

// Delete Job (Employer Only)
exports.deleteJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can delete jobs.' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this job.' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job' });
  }
};