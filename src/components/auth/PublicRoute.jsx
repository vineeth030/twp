// components/auth/PublicRoute.jsx
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Loading...</p>

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute
