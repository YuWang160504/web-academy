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
    <div className="container">
      <div className="row justify-content-center align-items-center text-center text-md-start">
        <div className="col-md-5 col-lg-4 mb-4 mb-md-0">
          <div style={{ 
            backgroundColor: '#d6f6f4',
            borderRadius: '12px',
            padding: '15px',
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
            margin: '0 auto'
          }}>
            <Link href="/" style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#230202',
              textDecoration: 'none'
            }}>&times;</Link>
            <h2 className="text-center mb-3">Register</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <small className="form-text text-muted">
                  Password must be at least 12 characters and contain both letters and numbers.
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Verify your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-check mb-3 text-start">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="terms" style={{ color: '#29645d' }}>
                  I agree to the terms & conditions
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white"
                style={{ backgroundColor: '#067e70' }}
              >
                Register
              </button>

              <div className="text-center mt-3">
                Already have an account?{' '}
                <Link href="/login" className="text-decoration-none" style={{ color: '#00796b' }}>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <Image 
            src="/go.png" 
            width={300} 
            height={300} 
            alt="Cartoon Character" 
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginTop: '1rem'
            }}
            className="mt-3 mt-md-0"
          />
        </div>
      </div>
    </div>
  );
} 