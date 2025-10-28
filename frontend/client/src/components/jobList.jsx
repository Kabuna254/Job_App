import { Link } from 'react-router-dom';

const JobList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center py-10 bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="no-jobs-card">
          <p className="text-gray-800 dark:text-gray-200 mb-4">No jobs found.</p>
          <Link 
            to="" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Post a job?
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4 px-4">
      {jobs.map((job) => (
        <li
          key={job._id}
          className="job-card border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
        >
          <h2 className="job-title text-lg font-semibold">{job.title}</h2>
          <p className="job-company">{job.companyName}</p>
          <p className="job-location text-sm">{job.location}</p>

          <div className="mt-4">
            <Link
              to={`/jobs/${job._id}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              View Details
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default JobList;