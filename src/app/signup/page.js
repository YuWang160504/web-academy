'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password.length < 12) {
      setError('Password must be at least 12 characters long');
      return false;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain both letters and numbers');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profilePicture: formData.profilePicture,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (formData.profilePicture) {
        localStorage.setItem('profilePic', formData.profilePicture);
      }

      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <Image src="/logo.png" width={45} height={45} alt="Logo" className="mb-2" />
                  <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Create Account</h3>
                  <p className="text-muted small mb-0">Join our learning community today</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center small" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-user me-2"></i>Username
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light py-2"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light py-2"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-lock me-2"></i>Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control bg-light py-2"
                        id="password"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        style={{ borderRadius: '8px 0 0 8px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 8px 8px 0' }}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <small className="form-text text-muted" style={{ fontSize: '0.7rem' }}>
                      <i className="fas fa-info-circle me-1"></i>
                      Password must be at least 12 characters and contain both letters and numbers.
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-lock me-2"></i>Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control bg-light py-2"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Verify password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        style={{ borderRadius: '8px 0 0 8px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ borderRadius: '0 8px 8px 0' }}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <label className="form-check-label text-muted" style={{ fontSize: '0.8rem' }}>
                        I agree to the <a href="#" className="text-decoration-none" style={{ color: '#067e70' }}>Terms of Service</a> and <a href="#" className="text-decoration-none" style={{ color: '#067e70' }}>Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 text-white mb-3"
                    style={{ 
                      background: 'linear-gradient(to right, #067e70, #0aa192)',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </button>

                  <div className="text-center">
                    <p className="text-muted small mb-0">
                      Already have an account?{' '}
                      <Link href="/login" className="text-decoration-none fw-semibold" style={{ color: '#067e70' }}>
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 