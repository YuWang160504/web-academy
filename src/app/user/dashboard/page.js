'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize Bootstrap JavaScript
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
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

      {showProfileModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <Image
                    src="/profile.png"
                    width={60}
                    height={60}
                    alt="Profile"
                    className="rounded-circle"
                  />
                </div>
                <p className="mb-3">Welcome, {session.user.username || session.user.email}</p>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <Link href="/courses/category/frontend" className="btn btn-primary">
                    <i className="fas fa-code me-2"></i>
                    Explore Course
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <Image src="/BE.jpeg" alt="Back-End" width={400} height={200} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                <div className="card-body">
                  <h5 className="card-title">Back-End Development</h5>
                  <p className="card-text">Master server-side programming, databases, and API development.</p>
                  <Link href="/courses/category/backend" className="btn btn-primary">
                    <i className="fas fa-server me-2"></i>
                    Explore Course
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <Image src="/FW.jpeg" alt="Frameworks" width={400} height={200} className="card-img-top" style={{ objectFit: 'cover', height: '200px' }} />
                <div className="card-body">
                  <h5 className="card-title">Frameworks</h5>
                  <p className="card-text">Explore popular frameworks like React, Node.js, and more.</p>
                  <Link href="/courses/category/frameworks" className="btn btn-primary">
                    <i className="fas fa-cubes me-2"></i>
                    Explore Course
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-dark text-white text-center py-4">
        <p><strong>Email:</strong> ITAcademy123.edu.bt@gmail.com</p>
        <p><strong>Phone:</strong> +975 77645387 / 77234567</p>
        <p><strong>Postal Code:</strong> 123-34-556</p>
      </section>

      <section className="contact-form py-5">
        <div className="container">
          <h2 className="text-center mb-4">Contact Us</h2>
          <form className="mx-auto" style={{ maxWidth: '400px' }}>
            <input type="text" className="form-control mb-3" placeholder="Your Name" required />
            <input type="email" className="form-control mb-3" placeholder="Your Email" required />
            <textarea className="form-control mb-3" rows="4" placeholder="Your Message" required></textarea>
            <button type="submit" className="btn btn-success w-100">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="bg-black text-white text-center py-3">
        <p>© 2025 WEB Academy. All rights reserved</p>
      </footer>
    </>
  );
} 