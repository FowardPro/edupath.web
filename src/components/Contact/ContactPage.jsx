import React from 'react';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Contact Us</h1>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Get in Touch</h2>
          <p className={styles.cardText}>
            We'd love to hear from you! Reach out to our team for any questions, feedback, or support.
          </p>
          <div className={styles.contactInfo}>
            <div>
              <h3 className={styles.subTitle}>Email</h3>
              <p className={styles.subText}>info@edupath.com</p>
            </div>
            <div>
              <h3 className={styles.subTitle}>Phone</h3>
              <p className={styles.subText}>(123) 456-7890</p>
            </div>
            <div>
              <h3 className={styles.subTitle}>Address</h3>
              <p className={styles.subText}>123 Education St, Learning City, LC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
