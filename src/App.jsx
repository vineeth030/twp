import './App.css'
import TaskForm from '@/components/task-form'
import TaskListing from '@/components/task-listing'
import { useState, useEffect } from 'react'
import EmployeeForm from './components/employee-form'
import EmployeeListing from './components/employee-listing'
import TaskScheduler from './components/task-scheduler'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {

  const [employees, setEmployees] = useState([])
  const [showEmployees, setShowEmployees] = useState(false);

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = () => {
      fetch(`${API_BASE_URL}/api/employees`)
        .then((res) => { console.log('Fetching employees...'); return res.json(); })
        .then((data) => setEmployees(data.employees))
        .catch((err) => console.error(err));
  }
  
  return (
    <>
      <div className='flex justify-end mr-8'>
        { !showEmployees && ( <button className='text-white' onClick={() => setShowEmployees(prev => !prev)} >Manage Employees</button> )}
        { showEmployees && ( <button className='text-white' onClick={() => setShowEmployees(prev => !prev)} >Home</button> )}
      </div>
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
        {showEmployees && (
          <>
            <EmployeeForm employees={employees} setEmployees={setEmployees} />
            <EmployeeListing employees={employees} />
          </>
        )}

{!showEmployees && (
          <>
            {/* <TaskForm employees={employees} setEmployees={setEmployees} fetchEmployees={fetchEmployees}/>
            <TaskListing employees={employees} fetchEmployees={fetchEmployees}/> */
            <TaskScheduler />
            }
          </>
        )}
        
      </main>
    </>
  )
}

export default App
