'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import styles from './courses.module.css';

const CourseCategory = ({ title, videos, onWatchLater, watchLaterList, isAuthenticated }) => {
  const containerRef = useRef(null);
  const router = useRouter();

  const scrollCourses = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    }
  };

  // Helper to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleWatchLaterClick = (courseId) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    onWatchLater(courseId);
  };

  return (
    <div className={styles.courseCategory}>
      <div className={styles.categoryHeader}>
        <h3>{title}</h3>
        <div className={styles.scrollButtons}>
          <button 
            className={`${styles.scrollBtn} ${styles.scrollLeft}`} 
            onClick={() => scrollCourses(-1)}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className={`${styles.scrollBtn} ${styles.scrollRight}`} 
            onClick={() => scrollCourses(1)}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className={styles.courseList} ref={containerRef}>
        {videos.length === 0 ? (
          <div className={styles.noVideos}>
            <i className="fas fa-video-slash"></i>
            <p>No videos in this category yet.</p>
          </div>
        ) : (
          videos.map((video, index) => {
            const ytId = getYouTubeId(video.url);
            const isInWatchLater = watchLaterList.includes(video._id);
            return (
              <div key={video._id || index} className={styles.course}>
                <div className={styles.courseImage}>
                  {ytId ? (
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={video.title}
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <Image
                      src="/video-placeholder.png"
                      alt={video.title}
                      width={320}
                      height={180}
                      className={styles.image}
                    />
                  )}
                  <div className={styles.courseOverlay}>
                    <Link href={`/courses/${video._id}`} className={styles.viewDetails}>
                      <i className="fas fa-play-circle"></i>
                      <span>View Course</span>
                    </Link>
                  </div>
                </div>
                <div className={styles.courseInfo}>
                  <h4 className={styles.courseTitle}>{video.title}</h4>
                  {video.description && (
                    <p className={styles.courseDescription}>{video.description}</p>
                  )}
                  <div className={styles.courseMeta}>
                    <span className={styles.category}>
                      <i className="fas fa-tag"></i>
                      {video.category}
                    </span>
                    <div className={styles.courseActions}>
                      <Link href={video.url} target="_blank" rel="noopener noreferrer" className={styles.watchButton}>
                        <i className="fas fa-play"></i>
                        Watch Now
                      </Link>
                      {isAuthenticated && (
                        <button
                          onClick={() => handleWatchLaterClick(video._id)}
                          className={`${styles.watchLaterButton} ${isInWatchLater ? styles.inWatchLater : ''}`}
                          title={isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
                        >
                          <i className={`fas ${isInWatchLater ? 'fa-clock' : 'fa-clock'}`}></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [watchLaterList, setWatchLaterList] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch videos');
        setVideos(data.videos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchWatchLater = async () => {
      if (session) {
        try {
          const response = await fetch('/api/watchlater');
          const data = await response.json();
          if (response.ok) {
            setWatchLaterList(data.watchLater.map(course => course._id));
          }
        } catch (error) {
          console.error('Error fetching watch later list:', error);
        }
      }
    };
    fetchWatchLater();
  }, [session]);

  const handleWatchLater = async (courseId) => {
    if (!session) {
      router.push('/login');
      return;
    }

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

      const data = await response.json();

      if (response.ok) {
        if (isInWatchLater) {
          setWatchLaterList(prev => prev.filter(id => id !== courseId));
        } else {
          setWatchLaterList(prev => [...prev, courseId]);
        }
        // Show success message
        alert(data.message);
      } else {
        // Show error message
        alert(data.error || 'Failed to update watch later');
      }
    } catch (error) {
      console.error('Error updating watch later:', error);
      alert('Failed to update watch later. Please try again.');
    }
  };

  // Filter videos by category and search
  const filterVideos = (category) => {
    return videos.filter(v => {
      const matchesCategory = v.category === category;
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const frontendVideos = filterVideos('frontend');
  const backendVideos = filterVideos('backend');
  const frameworksVideos = filterVideos('frameworks');

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/home" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <h1>Web Development Courses</h1>
            <div className={styles.searchContainer}>
              <div className={styles.searchBox}>
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className={styles.categorySelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="frameworks">Frameworks</option>
              </select>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {loading ? (
            <div className={styles.loading}>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading courses...</span>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          ) : (
            <section className={styles.courses}>
              <CourseCategory 
                title="Front-End Development" 
                videos={frontendVideos} 
                onWatchLater={handleWatchLater}
                watchLaterList={watchLaterList}
                isAuthenticated={!!session}
              />
              <CourseCategory 
                title="Back-End Development" 
                videos={backendVideos} 
                onWatchLater={handleWatchLater}
                watchLaterList={watchLaterList}
                isAuthenticated={!!session}
              />
              <CourseCategory 
                title="Frameworks" 
                videos={frameworksVideos} 
                onWatchLater={handleWatchLater}
                watchLaterList={watchLaterList}
                isAuthenticated={!!session}
              />
            </section>
          )}
        </main>
      </div>
    </>
  );
} 