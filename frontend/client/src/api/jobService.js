import api from './api';

export const jobService = {
  /**
   * Get all jobs with pagination and filtering
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {Object} filters - Filter criteria {category, location, etc.}
   * @returns {Promise} Resolves with job data or throws error
   */
  getAllJobs: async (page = 1, limit = 10, filters = {}) => {
    try {
      // Validate parameters
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      
      // Build query params
      const params = new URLSearchParams({
        page: pageNumber,
        limit: limitNumber,
        ...filters
      });

      const response = await api.get(`/jobs?${params.toString()}`);
      return {
        jobs: response.data.jobs || response.data,
        total: response.data.total,
        page: response.data.page,
        pages: response.data.pages
      };
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw new Error(error.response?.data?.message || 'Failed to load jobs');
    }
  },

  /**
   * Get single job by ID or slug
   * @param {string} idOrSlug - Job ID or slug
   * @returns {Promise} Resolves with job data
   */
  getJob: async (idOrSlug) => {
    try {
      const response = await api.get(`/jobs/${encodeURIComponent(idOrSlug)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch job ${idOrSlug}:`, error);
      throw new Error(error.response?.data?.message || 'Job not found');
    }
  },

  /**
   * Create a new job (employer only)
   * @param {Object} jobData - Job details
   * @returns {Promise} Resolves with created job
   */
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create job:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to create job. Please check your data.'
      );
    }
  },

  /**
   * Update existing job
   * @param {string} id - Job ID
   * @param {Object} jobData - Updated job details
   * @returns {Promise} Resolves with updated job
   */
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update job ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to update job. You may not have permission.'
      );
    }
  },

  /**
   * Delete a job
   * @param {string} id - Job ID
   * @returns {Promise} Resolves with success message
   */
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete job ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete job. You may not have permission.'
      );
    }
  },

  /**
   * Apply for a job
   * @param {string} jobId - Job ID
   * @param {Object} applicationData - Application details
   * @returns {Promise} Resolves with application data
   */
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(
        `/jobs/${jobId}/apply`,
        applicationData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to apply for job ${jobId}:`, error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to submit application. Please try again.'
      );
    }
  },

  /**
   * Search jobs by keyword and filters
   * @param {string} query - Search term
   * @param {Object} filters - Additional filters
   * @returns {Promise} Resolves with search results
   */
  searchJobs: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      const response = await api.get(`/jobs/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search jobs:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to search jobs. Please try again.'
      );
    }
  }
};