import React, { useState, useEffect } from 'react';
import { jobService } from '../api/jobService';
import { authService } from '../api/authService';

const JobCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    // Adjust condition based on your backend's user structure:
    if (user && user.role === 'employer' && user.isVerifiedEmployer) {
      setIsAllowed(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob({ title, description });
      alert('Job created successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job.');
    }
  };

  if (!isAllowed) {
    return <p className="p-4 text-red-600 font-semibold">Access denied: Only verified employers can post jobs.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Post a New Job</h2>
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Post Job
      </button>
    </form>
  );
};

export default JobCreate;
