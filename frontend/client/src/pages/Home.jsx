import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../api/api';
import { authService } from '../api/authService';
import JobList from '../components/JobList';

const Home = () => {
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showDemoContent, setShowDemoContent] = useState(true);
  const user = authService.getCurrentUser();

  // Demo data for attractive homepage
  const demoJobs = [
    {
      _id: 'demo1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Kenya',
      location: 'Nairobi, Kenya',
      salary: 'KSh 150,000 - 250,000',
      type: 'Full-time',
      description: 'Join our innovative team building cutting-edge solutions for African markets.',
      postedAt: new Date().toISOString(),
      isDemo: true
    },
    {
      _id: 'demo2',
      title: 'Marketing Manager',
      company: 'GrowthHub Africa',
      location: 'Mombasa, Kenya',
      salary: 'KSh 80,000 - 120,000',
      type: 'Full-time',
      description: 'Lead marketing initiatives for our expanding portfolio of clients.',
      postedAt: new Date().toISOString(),
      isDemo: true
    },
    {
      _id: 'demo3',
      title: 'Data Analyst',
      company: 'DataFlow Solutions',
      location: 'Kisumu, Kenya',
      salary: 'KSh 100,000 - 150,000',
      type: 'Remote',
      description: 'Analyze data trends and provide insights for business growth.',
      postedAt: new Date().toISOString(),
      isDemo: true
    },
    {
      _id: 'demo4',
      title: 'UX Designer',
      company: 'DesignStudio Kenya',
      location: 'Nairobi, Kenya',
      salary: 'KSh 90,000 - 140,000',
      type: 'Hybrid',
      description: 'Create beautiful and functional user experiences for our digital products.',
      postedAt: new Date().toISOString(),
      isDemo: true
    }
  ];

  const featuredCompanies = [
    { name: 'Safaricom', logo: '📱', jobs: 45 },
    { name: 'KCB Bank', logo: '🏦', jobs: 32 },
    { name: 'Equity Bank', logo: '💰', jobs: 28 },
    { name: 'Microsoft Kenya', logo: '💻', jobs: 15 },
    { name: 'Google Kenya', logo: '🔍', jobs: 12 },
    { name: 'IBM Kenya', logo: '🔧', jobs: 8 }
  ];

  const jobCategories = [
    { name: 'Technology', count: 156, icon: '💻' },
    { name: 'Finance', count: 89, icon: '💰' },
    { name: 'Healthcare', count: 67, icon: '🏥' },
    { name: 'Education', count: 45, icon: '📚' },
    { name: 'Marketing', count: 78, icon: '📢' },
    { name: 'Engineering', count: 92, icon: '⚙️' }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getAllJobs(page);
        
        // Handle different response structures
        const jobsData = response.data?.jobs || response.jobs || response;
        const pagesData = response.data?.totalPages || response.totalPages || 1;
        
        setJobs(jobsData);
        setTotalPages(pagesData);
        setError(null);
        
        // Show demo content if no real jobs
        if (!jobsData || jobsData.length === 0) {
          setShowDemoContent(true);
        } else {
          setShowDemoContent(false);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError(err.response?.data?.message || 'Failed to load jobs');
        setJobs([]);
        setShowDemoContent(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  const displayJobs = showDemoContent ? demoJobs : jobs;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Dream Job in Kenya
          </h1>
          <p className="hero-subtitle">
            Connect with top employers and discover opportunities across Kenya's growing economy
          </p>
          
          <div className="hero-search">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Job title, keywords, or company"
                className="search-input"
              />
              <input 
                type="text" 
                placeholder="Location"
                className="search-input"
              />
              <button className="search-button">
                Search Jobs
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">2,500+</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Job Seekers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {jobCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="companies-section">
        <div className="section-container">
          <h2 className="section-title">Featured Companies</h2>
          <div className="companies-grid">
            {featuredCompanies.map((company, index) => (
              <div key={index} className="company-card">
                <div className="company-logo">{company.logo}</div>
                <h3 className="company-name">{company.name}</h3>
                <p className="company-jobs">{company.jobs} open positions</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="jobs-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Latest Job Opportunities</h2>
            <Link to="/jobBrowser" className="view-all-link">
              View All Jobs →
            </Link>
          </div>
          
          {loading && jobs.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Failed to load jobs. Showing demo content.</p>
            </div>
          ) : (
            <>
              <JobList jobs={displayJobs} />
              
              {showDemoContent && (
                <div className="demo-notice">
                  <p>🎯 This is demo content. <Link to="/register">Register</Link> to see real job postings!</p>
                </div>
              )}
              
              {/* Pagination */}
              {!showDemoContent && totalPages > 1 && (
                <div className="pagination">
                  <button
                    className={`pagination-button ${page === 1 ? 'disabled' : ''}`}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    className={`pagination-button ${page >= totalPages ? 'disabled' : ''}`}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">
              {user ? (
                user.role === 'employer' ? 
                'Ready to Find Great Talent?' : 
                'Ready to Find Your Next Opportunity?'
              ) : (
                'Ready to Start Your Career Journey?'
              )}
            </h2>
            <p className="cta-subtitle">
              {user ? (
                user.role === 'employer' ? 
                'Post your job openings and connect with qualified candidates' : 
                'Browse thousands of opportunities and apply to your dream job'
              ) : (
                'Join thousands of job seekers and employers already using our platform'
              )}
            </p>
            <div className="cta-buttons">
              {user ? (
                user.role === 'employer' ? (
                  <Link to="/create-job" className="cta-button primary">
                    Post a Job
                  </Link>
                ) : (
                  <Link to="/jobBrowser" className="cta-button primary">
                    Browse Jobs
                  </Link>
                )
              ) : (
                <>
                  <Link to="/register" className="cta-button primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;