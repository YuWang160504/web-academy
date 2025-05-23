'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

function TabButton({ active, onClick, children }) {
  return (
    <button className={`btn btn-outline-primary me-2${active ? ' active' : ''}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

// Add styles for sidebar navigation
const sidebarButtonStyle = {
  color: '#222',
  fontWeight: 600,
  background: 'transparent',
  border: 'none',
  borderLeft: '4px solid transparent',
  width: '100%',
  textAlign: 'left',
  padding: '16px 32px',
  outline: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: '#f8f9fa',
    borderLeft: '4px solid #007bff',
  },
  '&.active': {
    background: '#f8f9fa',
    borderLeft: '4px solid #007bff',
    color: '#007bff',
  }
};

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`card text-white mb-3`} style={{ backgroundColor: color, minWidth: 180 }}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h5 className="card-title mb-1">{title}</h5>
          <h3 className="card-text mb-0">{value}</h3>
        </div>
        <div style={{ fontSize: 36 }}>{icon}</div>
      </div>
    </div>
  );
}

function ConfirmationModal({ show, onClose, onConfirm, title, message }) {
  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center py-4">
            <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState({ users: 0, videos: 0, messages: 0 });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Video management state
  const [videos, setVideos] = useState([]);
  const [videoForm, setVideoForm] = useState({ title: '', url: '', description: '', category: '', _id: null });
  const [videoError, setVideoError] = useState('');
  const [videoSuccess, setVideoSuccess] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const categoryMap = {
    frontend: "Front-End",
    backend: "Back-End",
    frameworks: "Frameworks"
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.replace('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch analytics
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    const [usersRes, videosRes, messagesRes] = await Promise.all([
      fetch('/api/users', { credentials: 'include' }),
      fetch('/api/videos', { credentials: 'include' }),
      fetch('/api/messages', { credentials: 'include' }),
    ]);
    const usersData = await usersRes.json();
    const videosData = await videosRes.json();
    const messagesData = await messagesRes.json();
    setAnalytics({
      users: usersData.users?.length || 0,
      videos: videosData.videos?.length || 0,
      messages: messagesData.messages?.length || 0,
    });
    setAnalyticsLoading(false);
  };

  // Fetch videos
  const fetchVideos = async () => {
    setVideoLoading(true);
    const res = await fetch('/api/videos', { credentials: 'include' });
    const data = await res.json();
    setVideos(data.videos || []);
    setVideoLoading(false);
  };

  // Fetch messages
  const fetchMessages = async () => {
    setMsgLoading(true);
    const res = await fetch('/api/messages', { credentials: 'include' });
    const data = await res.json();
    setMessages(data.messages || []);
    setMsgLoading(false);
  };

  // Fetch users
  const fetchUsers = async () => {
    setUserLoading(true);
    const res = await fetch('/api/users', { credentials: 'include' });
    const data = await res.json();
    setUsers(data.users || []);
    setUserLoading(false);
  };

  useEffect(() => {
    if (tab === 'analytics') fetchAnalytics();
    if (tab === 'videos') fetchVideos();
    if (tab === 'messages') fetchMessages();
    if (tab === 'users') fetchUsers();
    // eslint-disable-next-line
  }, [tab]);

  // Video form handlers
  const handleVideoFormChange = e => {
    const { name, value } = e.target;
    setVideoForm(prev => {
      const updated = { ...prev, [name]: value };
      console.log('Video form updated:', updated); // DEBUG
      return updated;
    });
  };

  const handleVideoSubmit = async e => {
    e.preventDefault();
    setVideoError('');
    setVideoSuccess('');
    setVideoLoading(true);
    if (!videoForm.category) {
      setVideoError('Please select a category.');
      setVideoLoading(false);
      return;
    }
    try {
      const method = videoForm._id ? 'PUT' : 'POST';
      const url = videoForm._id ? `/api/videos/${videoForm._id}` : '/api/videos';
      
      console.log('Submitting video:', { ...videoForm, _id: undefined }); // Debug log
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          title: videoForm.title, 
          url: videoForm.url, 
          description: videoForm.description,
          category: videoForm.category
        })
      });

      const data = await res.json();
      console.log('Video submission response:', data); // Debug log

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save video');
      }

      setVideoSuccess(videoForm._id ? 'Video updated!' : 'Video added!');
      setVideoForm({ title: '', url: '', description: '', category: '', _id: null });
      fetchVideos();
    } catch (err) {
      console.error('Error submitting video:', err); // Debug log
      setVideoError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleEditVideo = video => setVideoForm({ ...video, category: video.category || 'frontend' });

  const handleDeleteVideo = async id => {
    setConfirmModal({
      show: true,
      title: 'Delete Video',
      message: 'Are you sure you want to delete this video? This action cannot be undone.',
      onConfirm: async () => {
        setVideoLoading(true);
        try {
          const res = await fetch(`/api/videos/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Failed to delete video');
          fetchVideos();
          setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
        } catch (err) {
          setVideoError(err.message);
        } finally {
          setVideoLoading(false);
        }
      }
    });
  };

  // User management handlers (scaffold)
  const handleChangeRole = async (id, newRole) => {
    setUserError('');
    setUserLoading(true);
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to change role');
      fetchUsers();
    } catch (err) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async id => {
    setConfirmModal({
      show: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: async () => {
        setUserLoading(true);
        try {
          const res = await fetch(`/api/users/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Failed to delete user');
          fetchUsers();
          setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
        } catch (err) {
          setUserError(err.message);
        } finally {
          setUserLoading(false);
        }
      }
    });
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

  // Message handlers
  const handleDeleteMessage = async (id) => {
    setConfirmModal({
      show: true,
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/messages?id=${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (!res.ok) {
            throw new Error('Failed to delete message');
          }
          
          // Refresh messages after deletion
          fetchMessages();
          setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
        } catch (err) {
          setMsgError(err.message);
        }
      }
    });
  };

  if (status === 'loading' || !session) {
    return <div className="container py-5">Loading...</div>;
  }
  if (session.user.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ background: '#f4f8fb', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 250, background: '#fff', boxShadow: '2px 0 8px rgba(0,0,0,0.04)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="d-flex align-items-center gap-2 p-4 border-bottom">
            <Image src="/logo.png" alt="Logo" width={36} height={36} />
            <span className="fw-bold fs-5">Admin</span>
          </div>
          <nav className="flex-column mt-3">
            <button
              style={{
                ...sidebarButtonStyle,
                ...(tab === 'analytics' ? { background: '#f8f9fa', borderLeft: '4px solid #007bff', color: '#007bff' } : {})
              }}
              onClick={() => setTab('analytics')}
            >
              <i className="fas fa-chart-line me-2"></i> Analytics
            </button>
            <button
              style={{
                ...sidebarButtonStyle,
                ...(tab === 'videos' ? { background: '#f8f9fa', borderLeft: '4px solid #007bff', color: '#007bff' } : {})
              }}
              onClick={() => setTab('videos')}
            >
              <i className="fas fa-video me-2"></i> Videos
            </button>
            <button
              style={{
                ...sidebarButtonStyle,
                ...(tab === 'messages' ? { background: '#f8f9fa', borderLeft: '4px solid #007bff', color: '#007bff' } : {})
              }}
              onClick={() => setTab('messages')}
            >
              <i className="fas fa-envelope me-2"></i> Messages
            </button>
            <button
              style={{
                ...sidebarButtonStyle,
                ...(tab === 'users' ? { background: '#f8f9fa', borderLeft: '4px solid #007bff', color: '#007bff' } : {})
              }}
              onClick={() => setTab('users')}
            >
              <i className="fas fa-users me-2"></i> Users
            </button>
          </nav>
        </div>
        <div className="p-4 border-top">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section
          className="d-flex flex-column align-items-center justify-content-center mb-4 p-4 shadow-sm"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(90deg, #178D8D 0%, #43cea2 100%)',
            color: '#fff',
            minHeight: '320px',
            boxShadow: '0 4px 16px rgba(23,141,141,0.10)'
          }}
        >
          <img src="/videomake.png" alt="Admin Hero" style={{ maxHeight: 180, width: 'auto', borderRadius: '18px', marginBottom: 24, boxShadow: '0 2px 12px rgba(23,141,141,0.10)' }} />
          <h1 className="fw-bold display-5 mb-2 text-center" style={{ letterSpacing: 1 }}>Welcome to the Admin Hub</h1>
          <p className="lead mb-0 text-center" style={{ fontWeight: 500 }}>Empower your academy. Manage users, videos, and messages with confidence!</p>
          {/* Welcome Message below image */}
          <div
            className="d-flex align-items-center justify-content-center gap-3 mt-4 shadow-sm"
            style={{
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
              color: '#178D8D',
              fontWeight: 600,
              fontSize: '1.25rem',
              padding: '1.2rem 2rem',
              boxShadow: '0 2px 8px rgba(23,141,141,0.07)'
            }}
          >
            <i className="fas fa-hand-sparkles fa-lg"></i>
            <span>Welcome back, {session.user.username || session.user.email}!</span>
          </div>
        </section>

        {/* Back to Dashboard Button */}
        {tab !== null && (
          <button
            className="btn btn-outline-secondary mb-4"
            style={{ fontWeight: 500, borderRadius: '8px' }}
            onClick={() => setTab(null)}
          >
            <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
          </button>
        )}

        {/* Dashboard Cards (Main Navigation) */}
        {tab === null && (
          <div className="row g-4 mb-4 justify-content-center">
            <div className="col-12 col-sm-6 col-lg-3 d-flex">
              <div className="card h-100 w-100 shadow-sm border-0 dashboard-card-hover" style={{ cursor: 'pointer', background: '#f0f6fa', minHeight: 180, padding: '1.5rem 0' }} onClick={() => setTab('analytics')}>
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                  <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
                  <h4 className="fw-bold mb-2">Analytics</h4>
                  <p className="mb-0 text-muted fs-6">View academy stats</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3 d-flex">
              <div className="card h-100 w-100 shadow-sm border-0 dashboard-card-hover" style={{ cursor: 'pointer', background: '#f0f6fa', minHeight: 180, padding: '1.5rem 0' }} onClick={() => setTab('videos')}>
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                  <i className="fas fa-video fa-3x mb-3 text-success"></i>
                  <h4 className="fw-bold mb-2">Videos</h4>
                  <p className="mb-0 text-muted fs-6">Manage all videos</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3 d-flex">
              <div className="card h-100 w-100 shadow-sm border-0 dashboard-card-hover" style={{ cursor: 'pointer', background: '#f0f6fa', minHeight: 180, padding: '1.5rem 0' }} onClick={() => setTab('messages')}>
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                  <i className="fas fa-envelope fa-3x mb-3 text-warning"></i>
                  <h4 className="fw-bold mb-2">Messages</h4>
                  <p className="mb-0 text-muted fs-6">View contact messages</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3 d-flex">
              <div className="card h-100 w-100 shadow-sm border-0 dashboard-card-hover" style={{ cursor: 'pointer', background: '#f0f6fa', minHeight: 180, padding: '1.5rem 0' }} onClick={() => setTab('users')}>
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                  <i className="fas fa-users fa-3x mb-3 text-info"></i>
                  <h4 className="fw-bold mb-2">Users</h4>
                  <p className="mb-0 text-muted fs-6">Manage users</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {tab === 'analytics' && (
          <div>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <SummaryCard title="Total Users" value={analytics.users} icon={<i className="fas fa-users" />} color="#007bff" />
              </div>
              <div className="col-md-4">
                <SummaryCard title="Total Videos" value={analytics.videos} icon={<i className="fas fa-video" />} color="#28a745" />
              </div>
              <div className="col-md-4">
                <SummaryCard title="Messages" value={analytics.messages} icon={<i className="fas fa-envelope" />} color="#fd7e14" />
              </div>
            </div>
            {/* You can add charts or more analytics here */}
          </div>
        )}

        {/* Video Management Section */}
        {tab === 'videos' && (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h4 className="mb-3 fw-semibold text-primary">{videoForm._id ? 'Edit Video' : 'Add Video'}</h4>
              <form onSubmit={handleVideoSubmit} className="mb-4 row g-3 align-items-end">
                <div className="col-md-3">
                  <input type="text" name="title" className="form-control" placeholder="Title" value={videoForm.title} onChange={handleVideoFormChange} required />
                </div>
                <div className="col-md-3">
                  <input type="url" name="url" className="form-control" placeholder="Video URL" value={videoForm.url} onChange={handleVideoFormChange} required />
                </div>
                <div className="col-md-3">
                  <select name="category" className="form-select" value={videoForm.category} onChange={handleVideoFormChange} required>
                    <option value="" disabled>Select Category</option>
                    <option value="frontend">Front-End</option>
                    <option value="backend">Back-End</option>
                    <option value="frameworks">Frameworks</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input type="text" name="description" className="form-control" placeholder="Description (optional)" value={videoForm.description} onChange={handleVideoFormChange} />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-success px-4" disabled={videoLoading}>{videoForm._id ? 'Update' : 'Add'} Video</button>
                  {videoForm._id && <button type="button" className="btn btn-secondary" onClick={() => setVideoForm({ title: '', url: '', description: '', category: '', _id: null })}>Cancel</button>}
                </div>
                {videoError && <div className="alert alert-danger mt-2 w-100">{videoError}</div>}
                {videoSuccess && <div className="alert alert-success mt-2 w-100">{videoSuccess}</div>}
              </form>
              <h5 className="mb-3">All Videos</h5>
              {videoLoading ? <div>Loading...</div> : (
                <div className="row g-3">
                  {videos.map(video => (
                    <div key={video._id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h6 className="fw-bold mb-2">{video.title}</h6>
                          <div className="mb-2">
                            <span className="badge bg-info text-dark">
                              {categoryMap[video.category] || "No Category"}
                            </span>
                          </div>
                          <div className="mb-2 text-truncate" title={video.url}><a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></div>
                          {video.description && <div className="mb-2 text-muted small">{video.description}</div>}
                          <div className="d-flex gap-2 mt-2">
                            <button className="btn btn-sm btn-primary" onClick={() => handleEditVideo(video)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteVideo(video._id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {videos.length === 0 && <div className="text-muted ms-3">No videos uploaded yet.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Section */}
        {tab === 'messages' && (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h4 className="mb-3 fw-semibold text-primary">Contact Messages</h4>
              {msgError && <div className="alert alert-danger">{msgError}</div>}
              {msgLoading ? <div>Loading...</div> : (
                <ul className="list-group">
                  {messages.map(msg => (
                    <li key={msg._id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{msg.name}</strong> ({msg.email})<br />
                        <span>{msg.message}</span>
                        <div className="text-muted small">{new Date(msg.createdAt).toLocaleString()}</div>
                      </div>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                  ))}
                  {messages.length === 0 && <li className="list-group-item">No messages yet.</li>}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* User Management Section */}
        {tab === 'users' && (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h4 className="mb-3 fw-semibold text-primary">User Management</h4>
              {userError && <div className="alert alert-danger">{userError}</div>}
              {userLoading ? <div>Loading...</div> : (
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <select value={user.role} onChange={e => handleChangeRole(user._id, e.target.value)} className="form-select form-select-sm d-inline w-auto me-2">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={4}>No users found.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Admin Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <Image src="/profile.png" width={60} height={60} alt="Profile" className="rounded-circle" />
                </div>
                <p className="mb-3">Welcome, {session.user.email}</p>
                <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
} 