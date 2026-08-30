import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout, user} = useAuth()
  return (
    <nav>
      {user 
      ? 
      (<>
      <Link to='/place'>View Places</Link>
      <Link to='/recommended'>Recommendations</Link>
      <Link to='/visit'>Visit History</Link>

      <button onClick={logout}>Sign Out</button>
      </>) : 
      (<>
        <Link to='/sign-up'>Sign Up</Link>
        <Link to='/sign-in'>Sign In</Link>
      </>)}
    </nav>
  )
}

export default Navbar