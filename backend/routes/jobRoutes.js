const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const validateJobOwnership = require('../middleware/validateJobOwnership');

// Input validation rules
const jobValidationRules = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  body('qualifications')
    .isArray({ min: 1 })
    .withMessage('At least one qualification is required'),
  body('qualifications.*')
    .trim()
    .notEmpty()
    .withMessage('Qualification cannot be empty')
];

// Public routes
router.route('/')
  .get(getAllJobs);

// Employer-only routes
router.route('/')
  .post(
    protect,
    allowRoles('employer'),
    jobValidationRules,
    createJob
  );

router.route('/:id')
  .get(getJobById) // Public
  .put(
    protect,
    allowRoles('employer'),
    validateJobOwnership,
    jobValidationRules,
    updateJob
  )
  .delete(
    protect,
    allowRoles('employer'),
    validateJobOwnership,
    deleteJob
  );

module.exports = router;