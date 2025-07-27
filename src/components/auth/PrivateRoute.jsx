import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Loading...</p>

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
