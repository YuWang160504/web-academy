'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ContactSection from '@/components/ContactSection';
import Navigation from '@/components/Navigation';

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
      <Navigation />

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

      <section className="hero bg-light py-5 px-3 px-lg-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-left">
              <Image src="/fun.gif" alt="Animated student reading a book" width={300} height={300} className="mb-4" />
              <h2 className="display-4 font-weight-bold">Welcome to Web Academy!</h2>
              <p className="lead">Explore exciting courses that will help you shape your future and advance your career!</p>
              <div className="mt-3 text-center text-lg-left" style={{ paddingLeft: '2rem' }}>
                <Link href="/courses" className="btn btn-primary btn-lg rounded-pill px-4 py-2">Get Started</Link>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <Image src="/Technology.jpeg" alt="Digital learning concept" width={600} height={400} className="img-fluid rounded shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="courses text-center py-5 bg-secondary text-white">
        <h2>Explore Courses</h2>
        <div className="course-grid d-flex justify-content-center flex-wrap gap-4">
          <div className="course bg-light p-4 m-2 rounded text-dark">
            <h3>Front-End Development</h3>
            <Image src="/fE.jpeg" alt="Front-End" width={300} height={200} className="img-fluid" />
          </div>
          <div className="course bg-light p-4 m-2 rounded text-dark">
            <h3>Back-End Development</h3>
            <Image src="/BE.jpeg" alt="Back-End" width={300} height={200} className="img-fluid" />
          </div>
          <div className="course bg-light p-4 m-2 rounded text-dark">
            <h3>Frameworks</h3>
            <Image src="/FW.jpeg" alt="Frameworks" width={300} height={200} className="img-fluid" />
          </div>
        </div>
      </section>

      <section className="contact-form py-5 bg-white text-center">
        <h2>Contact Us</h2>
        <ContactSection />
      </section>

      <footer className="bg-dark text-white text-center py-3">
        <p>© 2025 WEB Academy. All rights reserved</p>
      </footer>

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
          position: relative;
        }

        .profile-tabs .nav-link.active {
          color: #007bff;
          background: none;
        }

        .profile-tabs .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #007bff;
        }

        .tab-content {
          min-height: 300px;
        }
      `}</style>
    </>
  );
} 