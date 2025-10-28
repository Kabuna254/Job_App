import { useEffect, useState, useRef } from 'react';
import { jobService } from '../api/jobService';

export const useJobs = (page = 1, limit = 10, filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const isMounted = useRef(true);
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortController.current.abort();
    };
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        abortController.current.abort();
        abortController.current = new AbortController();
        
        if (isMounted.current) {
          setLoading(true);
          setError(null);
        }

        const response = await jobService.getAllJobs(
          {
            page: Number(page),
            limit: Number(limit),
            ...filters
          },
          { signal: abortController.current.signal }
        );

        if (isMounted.current) {
          // Standardized response handling
          const data = response.data || response;
          const jobsData = Array.isArray(data) ? data : data.jobs || [];
          const pagesData = data.totalPages || 1;
          
          setJobs(jobsData);
          setTotalPages(pagesData);
        }
      } catch (err) {
        if (isMounted.current && err.name !== 'AbortError') {
          console.error('Failed to fetch jobs:', err);
          setError(err.response?.data?.message || 'Failed to load jobs');
          setJobs([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, [page, limit, JSON.stringify(filters)]);

  const refresh = useCallback(() => {
    abortController.current.abort();
    abortController.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    jobService.getAllJobs(
      {
        page: Number(page),
        limit: Number(limit),
        ...filters
      },
      { signal: abortController.current.signal }
    )
    .then(response => {
      if (isMounted.current) {
        const data = response.data || response;
        setJobs(Array.isArray(data) ? data : data.jobs || []);
        setTotalPages(data.totalPages || 1);
      }
    })
    .catch(err => {
      if (isMounted.current && err.name !== 'AbortError') {
        setError(err.response?.data?.message || 'Failed to refresh jobs');
      }
    })
    .finally(() => {
      if (isMounted.current) {
        setLoading(false);
      }
    });
  }, [page, limit, filters]);

  return { jobs, loading, error, totalPages, refresh };
};

export default useJobs;