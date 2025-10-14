import React from 'react';
import styles from './StaffPage.module.css';

const StaffPage = () => {
  const staffMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Director of Education',
      bio: 'Leading educational innovation with over 15 years of experience in curriculum development.',
      image: '👩‍🏫'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'AI Research Lead',
      bio: 'Expert in machine learning applications for education and personalized learning systems.',
      image: '👨‍💻'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Student Success Coordinator',
      bio: 'Dedicated to supporting student growth and career development through innovative programs.',
      image: '👩‍🎓'
    },
    {
      name: 'Mr. David Thompson',
      role: 'Technical Director',
      bio: 'Overseeing platform development and ensuring seamless user experiences.',
      image: '👨‍🔧'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Staff Directory</h1>
        <div className={styles.grid}>
          {staffMembers.map((member, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.avatar}>{member.image}</div>
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
