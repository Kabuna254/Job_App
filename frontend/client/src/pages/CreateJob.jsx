import { useNavigate } from 'react-router-dom';
import { jobService } from '../api/jobService';
import { authService } from '../api/authService';
import JobForm from '../components/jobForm';

const CreateJob = () => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.role === 'employer' && user.isVerifiedEmployer) {
      setIsAllowed(true);
    }
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await jobService.createJob(formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job.');
    }
  };

  if (!isAllowed) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <p className="text-red-600 font-semibold">
          Access denied: Only verified employers can post jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateJob;