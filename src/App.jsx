import './App.css'
import TaskForm from '@/components/task-form'
import TaskListing from '@/components/task-listing'
import { useState, useEffect, useContext } from 'react'
import useAuth from './components/auth/useAuth'
import Login from './components/login'
import Dashboard from './components/dashboard'
import EmployeeForm from './components/employee-form'
import EmployeeListing from './components/employee-listing'
import TaskScheduler from './components/task-scheduler'

import { AuthContext } from './components/auth/AuthContext'
import SignUp from './components/signup'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {

  const { user, loading } = useContext(AuthContext);
  const [ openSignUpForm, setOpenSignUpForm ] = useState(false);

  if (loading) return <p>Loading...</p>;
  
  return user ? <Dashboard /> : 
    !openSignUpForm ? <Login setOpenSignUpForm={setOpenSignUpForm} /> : <SignUp setOpenSignUpForm={setOpenSignUpForm} />;
}

export default App
