'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ContactSection from '@/components/ContactSection';

export default function UserDashboard() {
  const { data: session, status, update: updateSession } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [profileData, setProfileData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    profilePicture: null
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize Bootstrap JavaScript
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    
    // Fetch watch later list
    if (session) {
      fetchWatchLaterList();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      setProfileData(prev => ({
        ...prev,
        username: session.user.username || ''
      }));
    }
  }, [session]);

  const fetchWatchLaterList = async () => {
    try {
      const response = await fetch('/api/watchlater');
      const data = await response.json();
      if (response.ok) {
        setWatchLaterList(data.watchLater.map(course => course._id));
      }
    } catch (error) {
      console.error('Error fetching watch later list:', error);
    }
  };

  const handleWatchLater = async (courseId) => {
    try {
      const isInWatchLater = watchLaterList.includes(courseId);
      const method = isInWatchLater ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/watchlater', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        if (isInWatchLater) {
          setWatchLaterList(prev => prev.filter(id => id !== courseId));
        } else {
          setWatchLaterList(prev => [...prev, courseId]);
        }
      }
    } catch (error) {
      console.error('Error updating watch later:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGetStarted = () => {
    if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/home');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setIsUpdating(true);

    try {
      // Validate passwords if being changed
      if (profileData.newPassword || profileData.currentPassword) {
        if (!profileData.currentPassword) {
          throw new Error('Current password is required to set a new password');
        }
        if (profileData.newPassword !== profileData.confirmNewPassword) {
          throw new Error('New passwords do not match');
        }
        if (profileData.newPassword.length < 12) {
          throw new Error('New password must be at least 12 characters long');
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(profileData.newPassword)) {
          throw new Error('New password must contain both letters and numbers');
        }
      }

      const updateData = {
        username: profileData.username,
        ...(profileData.currentPassword && {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        }),
        ...(profileData.profilePicture && {
          profilePicture: profileData.profilePicture
        })
      };

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update session with new user data
      await updateSession({
        ...session,
        user: {
          ...session.user,
          username: data.user.username,
          profilePicture: data.user.profilePicture
        }
      });

      setUpdateSuccess('Profile updated successfully!');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
    setShowEditProfile(false);
    setUpdateError('');
    setUpdateSuccess('');
    setProfileData({
      username: session?.user?.username || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      profilePicture: null
    });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const renderProfileView = () => (
    <div className="text-center">
      <div className="mb-4">
        <Image
          src={session?.user?.profilePicture || "/profile.png"}
          width={100}
          height={100}
          alt="Profile"
          className="rounded-circle"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <h5 className="mb-3">{session?.user?.username || session?.user?.email}</h5>
      <div className="d-grid gap-2">
        <button 
          className="btn btn-primary"
          onClick={() => setShowEditProfile(true)}
        >
          <i className="fas fa-user-edit me-2"></i>
          Edit Profile
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Log Out
        </button>
      </div>
    </div>
  );

  const renderEditProfileView = () => (
    <div>
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-link text-muted p-0 me-3"
          onClick={() => setShowEditProfile(false)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h5 className="mb-0">Edit Profile</h5>
      </div>

      <form onSubmit={handleProfileUpdate}>
        {/* Profile Picture */}
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <Image
              src={profileData.profilePicture || session?.user?.profilePicture || "/profile.png"}
              width={100}
              height={100}
              alt="Profile"
              className="rounded-circle"
              style={{ objectFit: 'cover' }}
            />
            <button
              type="button"
              className="btn btn-sm btn-primary position-absolute bottom-0 end-0"
              onClick={() => fileInputRef.current?.click()}
              style={{ borderRadius: '50%', padding: '0.5rem' }}
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label">
            <i className="fas fa-user me-2"></i>
            Username
          </label>
          <input
            type="text"
            className="form-control"
            value={profileData.username}
            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>

        {/* Current Password */}
        <div className="mb-3">
          <label className="form-label">
            <i className="fas fa-lock me-2"></i>
            Current Password
          </label>
          <input
            type="password"
            className="form-control"
            value={profileData.currentPassword}
            onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Enter current password to change it"
          />
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label className="form-label">
            <i className="fas fa-key me-2"></i>
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            value={profileData.newPassword}
            onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="Enter new password"
          />
          <small className="form-text text-muted">
            <i className="fas fa-info-circle me-1"></i>
            Password must be at least 12 characters and contain both letters and numbers
          </small>
        </div>

        {/* Confirm New Password */}
        <div className="mb-3">
          <label className="form-label">
            <i className="fas fa-key me-2"></i>
            Confirm New Password
          </label>
          <input
            type="password"
            className="form-control"
            value={profileData.confirmNewPassword}
            onChange={(e) => setProfileData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
            placeholder="Confirm new password"
          />
        </div>

        {updateError && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {updateError}
          </div>
        )}
        {updateSuccess && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            {updateSuccess}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderProfileModal = () => (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {showEditProfile ? 'Edit Profile' : 'Profile'}
            </h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            {showEditProfile ? renderEditProfileView() : renderProfileView()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-3" style={{ backgroundColor: '#128090' }}>
        <div className="container-fluid">
          <Link href="/home" className="navbar-brand">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>

          <div className="navbar-search-hamburger ms-auto d-flex d-lg-none align-items-center">
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

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" href="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/courses">Courses</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/user/watchlater">
                  <i className="fas fa-clock me-1"></i>
                  Watch Later
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#contact">Contact Us</Link>
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

      {showProfileModal && renderProfileModal()}

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
          <div className="row">
            <div className="col-md-4">
              <div className="card h-100">
                <Image src="/fE.jpeg" alt="Front-End" width={400} height={200} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                <div className="card-body">
                  <h5 className="card-title">Front-End Development</h5>
                  <p className="card-text">Learn HTML, CSS, JavaScript, and modern front-end frameworks.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link href="/courses/category/frontend" className="btn btn-primary">
                      <i className="fas fa-code me-2"></i>
                      Explore Course
                    </Link>
                    <button 
                      onClick={() => handleWatchLater('frontend-course-id')}
                      className={`btn ${watchLaterList.includes('frontend-course-id') ? 'btn-danger' : 'btn-outline-primary'}`}
                      title="Add to Watch Later"
                    >
                      <i className={`fas ${watchLaterList.includes('frontend-course-id') ? 'fa-clock' : 'fa-clock'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <Image src="/BE.jpeg" alt="Back-End" width={400} height={200} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                <div className="card-body">
                  <h5 className="card-title">Back-End Development</h5>
                  <p className="card-text">Master server-side programming, databases, and API development.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link href="/courses/category/backend" className="btn btn-primary">
                      <i className="fas fa-server me-2"></i>
                      Explore Course
                    </Link>
                    <button 
                      onClick={() => handleWatchLater('backend-course-id')}
                      className={`btn ${watchLaterList.includes('backend-course-id') ? 'btn-danger' : 'btn-outline-primary'}`}
                      title="Add to Watch Later"
                    >
                      <i className={`fas ${watchLaterList.includes('backend-course-id') ? 'fa-clock' : 'fa-clock'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <Image src="/FW.jpeg" alt="Frameworks" width={400} height={200} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                <div className="card-body">
                  <h5 className="card-title">Frameworks</h5>
                  <p className="card-text">Explore popular frameworks like React, Node.js, and more.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link href="/courses/category/frameworks" className="btn btn-primary">
                      <i className="fas fa-cubes me-2"></i>
                      Explore Course
                    </Link>
                    <button 
                      onClick={() => handleWatchLater('frameworks-course-id')}
                      className={`btn ${watchLaterList.includes('frameworks-course-id') ? 'btn-danger' : 'btn-outline-primary'}`}
                      title="Add to Watch Later"
                    >
                      <i className={`fas ${watchLaterList.includes('frameworks-course-id') ? 'fa-clock' : 'fa-clock'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form py-5 bg-white text-center">
        <h2>Contact Us</h2>
        <ContactSection />
      </section>

      <footer className="bg-black text-white text-center py-3">
        <p>© 2025 WEB Academy. All rights reserved</p>
      </footer>
    </>
  );
} 