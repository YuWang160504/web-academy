'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../courses.module.css';

export default function CategoryCourses({ params }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryTitles = {
    frontend: 'Front-End Development',
    backend: 'Back-End Development',
    frameworks: 'Frameworks'
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch videos');
        const categoryVideos = data.videos.filter(v => v.category === params.category);
        setVideos(categoryVideos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [params.category]);

  const getYouTubeId = (url) => {
    if (typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/user/dashboard" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </Link>
          <h1>{categoryTitles[params.category] || 'Courses'}</h1>
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
        ) : videos.length === 0 ? (
          <div className={styles.noVideos}>
            <i className="fas fa-video-slash"></i>
            <p>No courses available in this category yet.</p>
          </div>
        ) : (
          <div className={styles.courseGrid}>
            {videos.map((video) => {
              const ytId = getYouTubeId(video.url);
              return (
                <div key={video._id} className={styles.course}>
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
                  </div>
                  <div className={styles.courseInfo}>
                    <h4 className={styles.courseTitle}>{video.title}</h4>
                    {video.description && (
                      <p className={styles.courseDescription}>{video.description}</p>
                    )}
                    <div className={styles.courseMeta}>
                      <Link href={video.url} target="_blank" rel="noopener noreferrer" className={styles.watchButton}>
                        <i className="fas fa-play"></i>
                        Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 