const Job = require('../models/Job');

module.exports = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this job' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};