import { useState } from 'react';

const JobForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [salary, setSalary] = useState(initialData.salary || '');
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [qualifications, setQualifications] = useState(
    initialData.qualifications || ['']
  );

  const handleQualificationChange = (index, value) => {
    const newQualifications = [...qualifications];
    newQualifications[index] = value;
    setQualifications(newQualifications);
  };

  const addQualification = () => {
    setQualifications([...qualifications, '']);
  };

  const removeQualification = (index) => {
    if (qualifications.length > 1) {
      const newQualifications = qualifications.filter((_, i) => i !== index);
      setQualifications(newQualifications);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('location', location.trim());
    
    // Add non-empty qualifications
    qualifications
      .filter(q => q.trim() !== '')
      .forEach((q, index) => {
        formData.append(`qualifications[${index}]`, q.trim());
      });

    if (salary && salary.toString().trim() !== '') {
      formData.append('salary', salary.toString().trim());
    }

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div>
        <label className="block mb-1 font-medium">Job Title</label>
        <input
          type="text"
          placeholder="e.g. Senior Developer"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Job Description</label>
        <textarea
          placeholder="Describe the job responsibilities and requirements"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="6"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Qualifications</label>
        {qualifications.map((qualification, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder={`Qualification ${index + 1}`}
              value={qualification}
              onChange={e => handleQualificationChange(index, e.target.value)}
              className="flex-1 border p-2 rounded mr-2"
              required
            />
            <button
              type="button"
              onClick={() => removeQualification(index)}
              className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200"
              disabled={qualifications.length <= 1}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addQualification}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Another Qualification
        </button>
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <input
          type="text"
          placeholder="e.g. Remote, Nairobi, etc."
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Salary Range (optional)</label>
        <input
          type="text"
          placeholder="e.g. $80,000 - $100,000"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Company Logo (optional)</label>
        <input
          type="file"
          onChange={e => setLogoFile(e.target.files[0])}
          className="w-full border p-2 rounded"
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={submitting}
      >
        {initialData._id ? 'Update Job' : 'Post Job'}
      </button>
    </form>
  );
};

export default JobForm;