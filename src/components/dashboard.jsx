import { useState, useEffect } from "react"
import EmployeeForm from "./employee-form";
import EmployeeListing from "./employee-listing";
import TaskScheduler from "./task-scheduler";
import useAuth from "./auth/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    
    const { logout } = useAuth();
    const [employees, setEmployees] = useState([])
    const [showEmployees, setShowEmployees] = useState(false);
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetchEmployees()
    }, [])

    useEffect(() => {
        fetchTasks()
    }, []);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
        //setUser(data);
        }
    }

    const fetchEmployees = () => {
        const token = localStorage.getItem('token');

        fetch(`${API_BASE_URL}/api/employees`, {headers:{'Accept': 'application/json','Authorization': `Bearer ${token}`}})
          .then((res) => { console.log('Fetching employees...'); return res.json(); })
          .then((data) => setEmployees(data.employees))
          .catch((err) => console.error(err));
    }
  
    const fetchTasks = () => {
        const token = localStorage.getItem('token');

        fetch(`${API_BASE_URL}/api/tasks`, {headers:{'Accept': 'application/json', 'Authorization': `Bearer ${token}`}})
          .then((res) => res.json())
          .then((data) => setTasks(data.tasks))
          .catch((err) => console.error(err));
    }

    return (
        <>
            <div className='flex justify-end mr-8'>
            <button className='text-white' onClick={() => handleLogout()} >Logout</button>
            { !showEmployees && ( 
                <button className='text-white' onClick={() => setShowEmployees(prev => !prev)} >Manage Employees</button>
                )}
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
                {
                <TaskScheduler employees={employees} tasks={tasks}/>
                }
                </>
            )}
            
            </main>
        </>
    )
}