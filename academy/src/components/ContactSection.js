'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="contact-container" id="contact">
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-header">
            <h2>Let's Connect</h2>
            <p>Have questions? We're here to help!</p>
          </div>
          
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-text">
                <h3>Email</h3>
                <p>ITAcademy123.edu.bt@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="info-text">
                <h3>Phone</h3>
                <p>+975 77645387 / 77234567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-text">
                <h3>Postal Code</h3>
                <p>123-34-556</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="name">Your Name</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Your Email</label>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <label htmlFor="message">Your Message</label>
            </div>

            <button
              type="submit"
              className={`submit-btn ${status.type === 'loading' ? 'loading' : ''}`}
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-container {
          padding: 4rem 2rem;
          background: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          background: #f8f9fa;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .contact-info {
          background: #2c3e50;
          color: white;
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .contact-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #3498db, #2c3e50);
          opacity: 0.1;
        }

        .info-header {
          margin-bottom: 3rem;
        }

        .info-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .info-header p {
          font-size: 1.1rem;
          opacity: 0.8;
        }

        .info-items {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .info-item:hover {
          transform: translateX(10px);
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .info-text h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .info-text p {
          opacity: 0.8;
          margin: 0;
        }

        .contact-form {
          padding: 4rem 2rem;
          background: white;
        }

        .form-group {
          position: relative;
          margin-bottom: 2rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e1e1e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: transparent;
        }

        .form-group textarea {
          height: 150px;
          resize: none;
        }

        .form-group label {
          position: absolute;
          left: 1rem;
          top: 1rem;
          color: #666;
          transition: all 0.3s ease;
          pointer-events: none;
          background: white;
          padding: 0 0.5rem;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #3498db;
          outline: none;
        }

        .form-group input:focus + label,
        .form-group textarea:focus + label,
        .form-group input:not(:placeholder-shown) + label,
        .form-group textarea:not(:placeholder-shown) + label {
          top: -0.5rem;
          left: 0.8rem;
          font-size: 0.9rem;
          color: #3498db;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .submit-btn.loading {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .status-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
        }

        .status-message.success {
          background: #2ecc71;
          color: white;
        }

        .status-message.error {
          background: #e74c3c;
          color: white;
        }

        .status-message.loading {
          background: #3498db;
          color: white;
        }

        @media (max-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr;
          }

          .contact-info {
            padding: 2rem;
          }

          .contact-form {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
} 