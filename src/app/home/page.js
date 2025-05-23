'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    // Initialize Bootstrap JavaScript
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    
    // Debug session
    console.log('Current session:', session);
    if (session?.user) {
      console.log('User role:', session.user.role);
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleGetStarted = () => {
    if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/home');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-3" style={{ backgroundColor: '#128090' }}>
        <div className="container-fluid">
          <Link href="/home" className="navbar-brand">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>

          <div className="navbar-search-hamburger ms-auto d-flex d-lg-none align-items-center">
            <input type="text" className="form-control rounded-pill me-2" placeholder="Search..." />
            <button className="navbar-toggler me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span className="navbar-toggler-icon"></span>
            </button>
            <button 
              className="btn btn-link p-0" 
              onClick={() => setShowProfileModal(true)}
            >
              <Image
                src="/profile.png"
                width={40}
                height={40}
                alt="Profile"
                className="rounded-circle"
              />
            </button>
          </div>

          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <input type="text" className="form-control w-50 rounded-pill" placeholder="Search..." />
          </div>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" href="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/courses">Courses</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact Us</a>
              </li>
            </ul>
            <button 
              className="btn btn-link p-0 d-none d-lg-block ms-3" 
              onClick={() => setShowProfileModal(true)}
            >
              <Image
                src="/profile.png"
                width={40}
                height={40}
                alt="Profile"
                className="rounded-circle"
              />
            </button>
          </div>
        </div>
      </nav>

      {showProfileModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Profile Settings</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="profile-tabs">
                  <div className="nav nav-tabs" role="tablist">
                    <button 
                      className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="fas fa-user me-2"></i>Profile
                    </button>
                    <button 
                      className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <i className="fas fa-cog me-2"></i>Settings
                    </button>
                    <button 
                      className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="fas fa-shield-alt me-2"></i>Security
                    </button>
                  </div>

                  <div className="tab-content p-4">
                    {activeTab === 'profile' && (
                      <div className="profile-tab">
                        <div className="text-center mb-4">
                          <div className="position-relative d-inline-block">
                            <Image
                              src="/profile.png"
                              width={100}
                              height={100}
                              alt="Profile"
                              className="rounded-circle"
                            />
                            <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                              <i className="fas fa-camera"></i>
                            </button>
                          </div>
                          <h5 className="mt-3 mb-1">{session.user.username || session.user.email}</h5>
                          <p className="text-muted mb-0">{session.user.email}</p>
                        </div>
                        <div className="profile-info">
                          <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={session.user.username || ''} readOnly />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={session.user.email} readOnly />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'settings' && (
                      <div className="settings-tab">
                        <div className="mb-4">
                          <h6 className="mb-3">Notification Settings</h6>
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="emailNotif" />
                            <label className="form-check-label" htmlFor="emailNotif">Email Notifications</label>
                          </div>
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="courseNotif" />
                            <label className="form-check-label" htmlFor="courseNotif">Course Updates</label>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="messageNotif" />
                            <label className="form-check-label" htmlFor="messageNotif">Message Notifications</label>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h6 className="mb-3">Display Settings</h6>
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="darkMode" />
                            <label className="form-check-label" htmlFor="darkMode">Dark Mode</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="security-tab">
                        <div className="mb-4">
                          <h6 className="mb-3">Change Password</h6>
                          <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <button className="btn btn-primary">Update Password</button>
                        </div>
                        <div className="mb-4">
                          <h6 className="mb-3">Two-Factor Authentication</h6>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="twoFactor" />
                            <label className="form-check-label" htmlFor="twoFactor">Enable 2FA</label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-tabs .nav-tabs {
          border-bottom: 1px solid #dee2e6;
          padding: 0 1rem;
        }

        .profile-tabs .nav-link {
          border: none;
          color: #6c757d;
          padding: 1rem;
          margin-right: 1rem;
          font-weight: 500;
        }

        .profile-tabs .nav-link.active {
          color: #0d6efd;
          border-bottom: 2px solid #0d6efd;
          background: none;
        }

        .profile-tabs .nav-link:hover {
          border-color: transparent;
          color: #0d6efd;
        }

        .profile-info input {
          background-color: #f8f9fa;
        }

        .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .modal-content {
          border-radius: 1rem;
          border: none;
        }

        .modal-header {
          padding: 1.5rem 1.5rem 0.5rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem 1.5rem;
        }

        .btn-close:focus {
          box-shadow: none;
        }
      `}</style>

      <section className="hero text-center">
        <div className="container">
          <Image src="/fun.gif" alt="Book" width={80} height={80} className="mb-3" />
          <h2 className="fw-bold">Welcome to Web Academy!</h2>
          <p className="lead">Explore exciting courses that will help you shape your future!</p>
        </div>
      </section>

      <section className="text-center py-5 bg-light">
        <div className="container">
          <h2 className="mb-4">Explore Courses</h2>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3">
              <div className="card course-card">
                <Image src="/fE.jpeg" alt="Front-End" width={300} height={150} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Front-End Development</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card course-card">
                <Image src="/BE.jpeg" alt="Back-End" width={300} height={150} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Back-End Development</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card course-card">
                <Image src="/FW.jpeg" alt="Frameworks" width={300} height={150} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Frameworks</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      <footer className="bg-black text-white text-center py-3">
        <p>© 2025 WEB Academy. All rights reserved</p>
      </footer>
    </>
  );
} 