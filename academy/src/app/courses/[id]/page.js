'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './courseDetails.module.css';

// This would typically come from a database or API
const courseData = {
  'intro-web-dev': {
    id: 'intro-web-dev',
    title: 'Introduction to Web Development',
    image: '/one.jpeg',
    category: 'frontend',
    instructor: 'John Doe',
    duration: '8 weeks',
    level: 'Beginner',
    description: 'Learn the fundamentals of web development including HTML, CSS, and basic JavaScript. Perfect for beginners who want to start their journey in web development.',
    modules: [
      {
        title: 'Getting Started with HTML',
        lessons: ['Introduction to HTML', 'Basic HTML Structure', 'HTML Elements and Tags']
      },
      {
        title: 'CSS Fundamentals',
        lessons: ['Introduction to CSS', 'Selectors and Properties', 'Box Model and Layout']
      },
      {
        title: 'JavaScript Basics',
        lessons: ['Introduction to JavaScript', 'Variables and Data Types', 'Functions and Control Flow']
      }
    ],
    price: '$49.99',
    rating: 4.8,
    students: 1234
  },
  // Add more courses here...
};

export default function CourseDetails({ params }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const course = courseData[params.id] || {
    title: 'Course Not Found',
    description: 'The course you are looking for does not exist.',
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Here you would typically handle payment and enrollment logic
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  if (!courseData[params.id]) {
    return (
      <div className={styles.notFound}>
        <h1>Course Not Found</h1>
        <p>The course you are looking for does not exist.</p>
        <Link href="/courses" className={styles.backButton}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/courses" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Back to Courses
        </Link>
      </div>

      <div className={styles.courseHeader}>
        <div className={styles.courseImage}>
          <Image
            src={course.image}
            alt={course.title}
            width={800}
            height={400}
            className={styles.image}
            priority
          />
        </div>
        <div className={styles.courseInfo}>
          <h1>{course.title}</h1>
          <div className={styles.metaInfo}>
            <span><i className="fas fa-user"></i> {course.instructor}</span>
            <span><i className="fas fa-clock"></i> {course.duration}</span>
            <span><i className="fas fa-signal"></i> {course.level}</span>
            <span><i className="fas fa-star"></i> {course.rating}</span>
            <span><i className="fas fa-users"></i> {course.students} students</span>
          </div>
          <p className={styles.description}>{course.description}</p>
          <div className={styles.priceSection}>
            <span className={styles.price}>{course.price}</span>
            <button 
              className={`${styles.enrollButton} ${isEnrolled ? styles.enrolled : ''}`}
              onClick={handleEnroll}
              disabled={isEnrolled}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.courseContent}>
        <h2>Course Content</h2>
        <div className={styles.modules}>
          {course.modules?.map((module, index) => (
            <div key={index} className={styles.module}>
              <h3>{module.title}</h3>
              <ul className={styles.lessons}>
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <i className="fas fa-play-circle"></i>
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 