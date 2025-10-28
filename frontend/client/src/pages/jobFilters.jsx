import React from 'react';

const JobFilters = ({ filters, onChange, onReset }) => {
  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  const salaryMarks = {
    0: '$0',
    50000: '$50k',
    100000: '$100k',
    150000: '$150k',
    200000: '$200k'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  const handleSalaryChange = (e) => {
    onChange({ ...filters, salaryRange: [0, Number(e.target.value)] });
  };

  return (
    <aside className="md:w-1/4">
      <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button 
            onClick={onReset}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Reset All
          </button>
        </div>

        <div className="space-y-6">
          {/* Search Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Job title, skills"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="City, country"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Salary: ${filters.salaryRange[1].toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={filters.salaryRange[1]}
              onChange={handleSalaryChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {Object.entries(salaryMarks).map(([value, label]) => (
                <span key={value}>{label}</span>
              ))}
            </div>
          </div>

          {/* Remote Only */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remoteOnly"
              name="remoteOnly"
              checked={filters.remoteOnly || false}
              onChange={(e) => onChange({ ...filters, remoteOnly: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remoteOnly" className="ml-2 text-sm text-gray-700">
              Remote Only
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;