import './App.css'
import TaskForm from '@/components/task-form'
import TaskListing from '@/components/task-listing'
import { useState, useEffect } from 'react'
import useAuth from './components/auth/useAuth'
import Login from './components/login'
import Dashboard from './components/dashboard'
import EmployeeForm from './components/employee-form'
import EmployeeListing from './components/employee-listing'
import TaskScheduler from './components/task-scheduler'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {

  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);
  
  return isLoggedIn ? <Dashboard /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
}

export default App
