'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function WatchLaterPage() {
  const { data: session, status } = useSession();
  const [watchLaterVideos, setWatchLaterVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchWatchLaterVideos();
    }
  }, [session]);

  const fetchWatchLaterVideos = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/watchlater');
      const data = await response.json();
      
      if (response.ok) {
        setWatchLaterVideos(data.watchLater);
      } else {
        setError(data.error || 'Failed to fetch watch later videos');
      }
    } catch (error) {
      console.error('Error fetching watch later videos:', error);
      setError('Failed to load your watch later list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (videoId) => {
    try {
      const response = await fetch('/api/watchlater', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: videoId }),
      });

      const data = await response.json();

      if (response.ok) {
        setWatchLaterVideos(prev => prev.filter(video => video._id !== videoId));
        // Show success message
        alert(data.message);
      } else {
        // Show error message
        alert(data.error || 'Failed to remove video');
      }
    } catch (error) {
      console.error('Error removing video:', error);
      alert('Failed to remove video. Please try again.');
    }
  };

  // Helper to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Navigation />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Link href="/courses" className="btn btn-primary mt-3">
            Back to Courses
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1>My Watch Later List</h1>
          <Link href="/courses" className="btn btn-outline-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Courses
          </Link>
        </div>
        
        {watchLaterVideos.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-clock fa-3x mb-3 text-muted"></i>
            <p className="lead mb-4">Your watch later list is empty.</p>
            <Link href="/courses" className="btn btn-primary">
              <i className="fas fa-graduation-cap me-2"></i>
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {watchLaterVideos.map((video) => {
              const ytId = getYouTubeId(video.url);
              return (
                <div key={video._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      {ytId ? (
                        <div className="ratio ratio-16x9">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={video.title}
                            allowFullScreen
                            className="card-img-top"
                          ></iframe>
                        </div>
                      ) : (
                        <Image
                          src={video.thumbnail || '/video-placeholder.png'}
                          alt={video.title}
                          width={400}
                          height={225}
                          className="card-img-top"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{video.title}</h5>
                      {video.description && (
                        <p className="card-text text-muted">{video.description}</p>
                      )}
                      <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-primary me-2">{video.category}</span>
                        {video.duration && (
                          <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            {video.duration}
                          </small>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                        >
                          <i className="fas fa-play me-2"></i>
                          Watch Now
                        </a>
                        <button
                          onClick={() => handleRemove(video._id)}
                          className="btn btn-outline-danger"
                          title="Remove from Watch Later"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
} 