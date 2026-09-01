import React from 'react'
import styles from '../styles/Homepage.module.css'
import { Link } from 'react-router'

function Homepage() {
  return (
    <main className={styles.main}>
      <h1>Tal'a - Where to go today?</h1>
      <p>Personalized picks for going out in Bahrain</p>
      <Link to="/sign-up" className={styles.btn}>
        Explore Now
      </Link>
    </main>
  )
}

export default Homepage