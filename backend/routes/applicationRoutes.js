const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  deleteApplication
} = require('../controllers/applicationController');

// Apply for a job
router.post('/', protect, applyForJob);

// Get current user's applications
router.get('/me', protect, getMyApplications);

// Employer: Get applications for a specific job
router.get('/job/:jobId', protect, getApplicationsForJob);

// Delete application (either by applicant or job poster)
router.delete('/:applicationId', protect, deleteApplication);

module.exports = router;
