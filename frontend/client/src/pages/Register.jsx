import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";

const Register = () => {
  const [role, setRole] = useState("jobseeker");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    companyWebsite: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role-specific validation
    if (role === "jobseeker") {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Valid email is required";
      }
    } else {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.companyEmail.trim()) {
        newErrors.companyEmail = "Company email is required";
      } else if (!validateEmail(formData.companyEmail)) {
        newErrors.companyEmail = "Valid company email is required";
      }
      if (formData.companyWebsite && !formData.companyWebsite.match(/^https?:\/\//)) {
        newErrors.companyWebsite = "Website must start with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSecurityEvent = (e) => {
    e.preventDefault();
    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 3000);
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setShowForm(true);
    setErrors({});
    setSubmitError("");
  };

  const goBackToRoleSelection = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyEmail: "",
      companyWebsite: ""
    });
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
      
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      role: role === "jobseeker" ? "seeker" : "employer", // Match backend enum
      email: role === "jobseeker" ? formData.email : formData.companyEmail,
      password: formData.password,
      ...(role === "employer" ? {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyWebsite: formData.companyWebsite || undefined
      } : {
        name: formData.name
      })
    };

    try {
      const response = await authService.register(payload);
      if (response.success) {
        navigate("/login", { state: { registrationSuccess: true } });
      } else {
        setSubmitError(response.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setSubmitError(
        err.response?.data?.message || 
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="brightermonday-register">
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="register-logo">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">JobBoard</span>
          </Link>
          <h1>Create your Account</h1>
        </div>

        {!showForm ? (
          <div className="role-selection">
            <div className="role-cards">
              <div 
                className={`role-card ${role === "jobseeker" ? "selected" : ""}`}
                onClick={() => handleRoleSelection("jobseeker")}
              >
                <div className="role-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Job Seeker</h3>
                <p>Are you looking for your dream job?</p>
                <p className="role-description">Create a unique career profile with our platform</p>
                <button className="role-button">Sign up as seeker</button>
              </div>

              <div 
                className={`role-card ${role === "employer" ? "selected" : ""}`}
                onClick={() => handleRoleSelection("employer")}
              >
                <div className="role-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Employer</h3>
                <p>Are you looking for quality candidates?</p>
                <p className="role-description">Advertise and search with our platform</p>
                <button className="role-button">Sign up as employer</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="registration-form">
            <div className="form-header">
              <button onClick={goBackToRoleSelection} className="back-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <h2>Sign up as {role === "jobseeker" ? "Job Seeker" : "Employer"}</h2>
            </div>

            {submitError && (
              <div className="error-message">
                {submitError}
              </div>
            )}

            {showPasteWarning && (
              <div className="warning-message">
                For security, please type your password manually
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              {role === "jobseeker" ? (
                <>
                  <div className="form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "error" : ""}
                      placeholder="John Doe"
                      required
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Company Name*</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={errors.companyName ? "error" : ""}
                      placeholder="Acme Inc."
                      required
                    />
                    {errors.companyName && <span className="field-error">{errors.companyName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Company Email*</label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className={errors.companyEmail ? "error" : ""}
                      placeholder="contact@company.com"
                      required
                    />
                    {errors.companyEmail && <span className="field-error">{errors.companyEmail}</span>}
                  </div>
                  <div className="form-group">
                    <label>Company Website</label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className={errors.companyWebsite ? "error" : ""}
                      placeholder="https://company.com"
                    />
                    {errors.companyWebsite && <span className="field-error">{errors.companyWebsite}</span>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Password*</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onCopy={handleSecurityEvent}
                  onPaste={handleSecurityEvent}
                  onCut={handleSecurityEvent}
                  className={errors.password ? "error" : ""}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onCopy={handleSecurityEvent}
                  onPaste={handleSecurityEvent}
                  onCut={handleSecurityEvent}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Re-enter your password"
                  required
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? "loading" : ""}`}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="form-footer">
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Log in
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;