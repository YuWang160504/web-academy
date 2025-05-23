'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
      });

      if (result.error) {
        setError(result.error);
        return;
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <Image src="/logo.png" width={45} height={45} alt="Logo" className="mb-2" />
                  <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Welcome Back</h3>
                  <p className="text-muted small mb-0">Sign in to continue learning</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center small" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light py-2"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label text-muted fw-semibold small mb-0">
                        <i className="fas fa-lock me-2"></i>Password
                      </label>
                      <Link href="#" className="text-decoration-none small" style={{ color: '#067e70', fontSize: '0.8rem' }}>
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control bg-light py-2"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold small mb-1">
                      <i className="fas fa-user-shield me-2"></i>Login as
                    </label>
                    <select
                      className="form-select bg-light py-2"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="rememberMe" />
                      <label className="form-check-label text-muted small" htmlFor="rememberMe">
                        Keep me signed in
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
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </button>

                  <div className="text-center mb-3">
                    <p className="text-muted small mb-3">
                      New to our platform?{' '}
                      <Link href="/signup" className="text-decoration-none fw-semibold" style={{ color: '#067e70' }}>
                        Create Account
                      </Link>
                    </p>
                  </div>

                  <div className="position-relative mb-3">
                    <hr className="text-muted my-2" />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted" style={{ fontSize: '0.75rem' }}>
                      or continue with
                    </span>
                  </div>

                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-outline-danger btn-sm py-2" disabled>
                      <i className="fab fa-google me-2"></i>
                      Continue with Google
                    </button>
                    <button type="button" className="btn btn-outline-primary btn-sm py-2" disabled>
                      <i className="fab fa-facebook me-2"></i>
                      Continue with Facebook
                    </button>
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