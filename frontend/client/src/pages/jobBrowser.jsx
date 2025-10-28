import { useState } from 'react';
import { useJobs } from '../hooks/useAPI';
import JobFilters from './JobFilters';
import JobList from '..components/JobList';

const JobsBrowser = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    salaryRange: [0, 100000]
  });

  const { jobs, loading, error, totalPages, refresh } = useJobs(page, 10, filters);

  const handleFilterChange = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      salaryRange: [0, 100000]
    });
    setPage(1);
  };

  if (loading && !jobs.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Opportunities</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <JobFilters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
        
        <section className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <button
              onClick={refresh}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg mb-4">No jobs match your filters</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <JobList jobs={jobs} />
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <PaginationControls 
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

const PaginationControls = ({ page, totalPages, onPageChange }) => (
  <>
    <button
      onClick={() => onPageChange(1)}
      disabled={page === 1}
      className="px-3 py-1 rounded disabled:opacity-50 bg-blue-500 text-white"
    >
      First
    </button>
    <button
      onClick={() => onPageChange(p => Math.max(1, p - 1))}
      disabled={page === 1}
      className="px-3 py-1 rounded disabled:opacity-50 bg-blue-500 text-white"
    >
      Previous
    </button>
    
    <span className="px-3 py-1 bg-gray-100 rounded">
      Page {page} of {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
      disabled={page >= totalPages}
      className="px-3 py-1 rounded disabled:opacity-50 bg-blue-500 text-white"
    >
      Next
    </button>
    <button
      onClick={() => onPageChange(totalPages)}
      disabled={page >= totalPages}
      className="px-3 py-1 rounded disabled:opacity-50 bg-blue-500 text-white"
    >
      Last
    </button>
  </>
);

export default JobsBrowser;