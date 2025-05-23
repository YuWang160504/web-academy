'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize Bootstrap when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

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

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsNavCollapsed(true);

    // If not on home page, navigate to home and then scroll
    if (pathname !== '/home') {
      router.push('/home#contact');
      return;
    }

    // If on home page, smooth scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark p-3" style={{ backgroundColor: '#128090' }}>
      <div className="container-fluid">
        <Link href="/home" className="navbar-brand">
          <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
        </Link>

        <div className="navbar-search-hamburger ms-auto d-flex d-lg-none align-items-center">
          <button 
            className="navbar-toggler me-2" 
            type="button" 
            onClick={toggleNav}
            aria-controls="navbarContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {session && (
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
                priority
              />
            </button>
          )}
        </div>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/home" onClick={() => setIsNavCollapsed(true)}>
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/courses" onClick={() => setIsNavCollapsed(true)}>
                <i className="fas fa-graduation-cap me-1"></i>
                Courses
              </Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/user/watchlater" 
                  onClick={() => setIsNavCollapsed(true)}
                >
                  <i className="fas fa-clock me-1"></i>
                  Watch Later
                </Link>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="#contact" onClick={handleContactClick}>
                <i className="fas fa-envelope me-1"></i>
                Contact Us
              </a>
            </li>
          </ul>
          {session && (
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
                priority
              />
            </button>
          )}
        </div>
      </div>

      {showProfileModal && session && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Profile</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowProfileModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <Image
                    src="/profile.png"
                    width={80}
                    height={80}
                    alt="Profile"
                    className="rounded-circle"
                    priority
                  />
                </div>
                <p className="mb-3 h5">Welcome, {session.user.username || session.user.email}</p>
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
        .navbar-nav .nav-link {
          padding: 0.5rem 1rem;
          transition: color 0.3s ease;
        }
        
        .navbar-nav .nav-link:hover {
          color: #ffffff !important;
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #128090;
            padding: 1rem;
            z-index: 1000;
          }

          .navbar-nav {
            margin-right: 0 !important;
          }

          .nav-link {
            padding: 0.75rem 1rem !important;
            border-radius: 4px;
          }

          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </nav>
  );
} 