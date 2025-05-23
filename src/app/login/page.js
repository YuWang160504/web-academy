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
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center text-center text-md-start">
        <div className="col-md-6">
          <div className="login-box position-relative" style={{ backgroundColor: '#e0f2f1', padding: '2rem', borderRadius: '12px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
            <Link href="/" className="close-btn position-absolute top-0 end-0 mt-2 me-3 fs-4 text-decoration-none" style={{ color: '#333', zIndex: 2 }}>&times;</Link>
            <h2 className="mb-4 text-center">Login</h2>
            {error && (
              <div className="alert alert-danger text-center py-2" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Login as</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                </div>
                <a href="#" className="text-decoration-none" style={{ color: '#00796b' }}>Forgot Password?</a>
              </div>
              <button type="submit" className="btn w-100 mb-3" style={{ backgroundColor: '#00796b', color: 'white' }}>Login</button>
              <div className="text-center mb-3">
                Don't have an account? <Link href="/signup" className="text-decoration-none" style={{ color: '#00796b' }}>Register</Link>
              </div>
              <button type="button" className="btn btn-danger w-100 mb-2" disabled>Continue with Google</button>
              <button type="button" className="btn btn-primary w-100" disabled>Continue with Facebook</button>
            </form>
          </div>
        </div>
        <div className="col-md-4 text-center mt-4 mt-md-0">
          <Image src="/masha.png" width={250} height={250} alt="Cartoon Character" className="character" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </div>
    </div>
  );
} 