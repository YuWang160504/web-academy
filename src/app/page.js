'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import ContactSection from '@/components/ContactSection';

export default function LandingPage() {
  useEffect(() => {
    // Initialize Bootstrap JavaScript
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <header>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark d-flex align-items-center justify-content-between flex-wrap">
            <Link href="/" className="navbar-brand d-flex align-items-center mb-2 mb-lg-0">
              <Image src="/logo.png" alt="Logo" width={50} height={50} className="nav-logo mr-2" />
              Web Academy
            </Link>

            <div className="d-flex align-items-center flex-grow-1 justify-content-center my-2 my-lg-0" style={{ maxWidth: '500px' }}>
              <input type="text" placeholder="Search..." className="form-control mr-2 w-100" />
              <button type="submit" className="btn btn-success">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <button className="navbar-toggler mb-2 mb-lg-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav text-center">
                <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" href="#courses">Courses</Link></li>
                <li className="nav-item"><a className="nav-link" href="#contact">Contact Us</a></li>
                <li className="nav-item"><Link className="nav-link" href="/login">Login</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero bg-light py-5 px-3 px-lg-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-left">
              <Image src="/fun.gif" alt="Animated student reading a book" width={300} height={300} className="mb-4" />
              <h2 className="display-4 font-weight-bold">Welcome to Web Academy!</h2>
              <p className="lead">Explore exciting courses that will help you shape your future and advance your career!</p>
              <div className="mt-3 text-center text-lg-left" style={{ paddingLeft: '2rem' }}>
                <Link href="/login" className="btn btn-primary btn-lg rounded-pill px-4 py-2">Get Started</Link>
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
    </>
  );
}
