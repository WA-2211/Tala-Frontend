import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Navbar.module.css'
import Logo from '../images/Logo.png'

function Navbar() {
  const { logout, user} = useAuth()
  return (
    <nav className={styles.nav}>
      <a href='/'>
        <img src={Logo} alt="Tala Logo" className={styles.logo} style={{ width: '100px', height: '80px', position: 'absolute' , left: 0, top:' -12px'}} />
      </a>
     {user ? (
        <>
          {user.role === 'admin' ? (
            <>
              <Link to='/admin/place' className={styles.links}>Manage Places</Link>
              <Link to='/place' className={styles.links}>View Places</Link>
            </>
          ) : (
            <>
              <Link to='/recommended' className={styles.links}>Recommendations</Link>
              <Link to='/place' className={styles.links}>View Places</Link>
              <Link to='/plan' className={styles.links}>View Plans</Link>
              <Link to='/favorite' className={styles.links}>Favorites</Link>
              <Link to='/visit' className={styles.links}>Visit History</Link>
              <Link to='/invite' className={styles.links}>View Invitations</Link>
            </>
          )}
          <button onClick={logout} className={styles.btnSignout}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to='/place' className={styles.links}>View Places</Link>
          <Link to='/sign-up' className={styles.links}>Sign Up</Link>
          <Link to='/sign-in' className={styles.links}>Sign In</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar