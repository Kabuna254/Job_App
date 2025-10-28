import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jobService } from "../api/jobService";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicant, setApplicant] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      try {
        const data = await jobService.getJob(id);
        setJob(data);
        setApplications(data.applications || []);
        setError("");
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applicant.name.trim() || !applicant.email.trim()) return;
    try {
      const newApplication = await jobService.applyForJob(id, applicant);
      setApplications([...applications, newApplication]);
      setApplicant({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to apply for the job");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return null;

  const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-700 mb-4">{job.description}</p>

      {isExpired ? (
        <p className="text-red-600 font-semibold">
          We no longer accept applications for this job.
        </p>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Apply for this Job</h3>
          <form onSubmit={handleApply} className="space-y-2">
            <input
              type="text"
              value={applicant.name}
              onChange={e => setApplicant({ ...applicant, name: e.target.value })}
              placeholder="Your Name"
              className="border p-2 w-full"
              required
            />
            <input
              type="email"
              value={applicant.email}
              onChange={e => setApplicant({ ...applicant, email: e.target.value })}
              placeholder="Your Email"
              className="border p-2 w-full"
              required
            />
            <textarea
              value={applicant.message}
              onChange={e => setApplicant({ ...applicant, message: e.target.value })}
              placeholder="Cover letter / Message / CV Link"
              className="border p-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Application
            </button>
          </form>
        </>
      )}

      {applications.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Applications ({applications.length})</h4>
          <ul className="space-y-3">
            {applications.map((app, idx) => (
              <li key={app._id || idx} className="p-2 border rounded bg-gray-50">
                <p><strong>{app.name}</strong> ({app.email})</p>
                <p className="text-sm text-gray-600">{app.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
