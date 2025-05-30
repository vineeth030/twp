import { useState, useEffect } from "react"
import EmployeeForm from "./employee-form";
import EmployeeListing from "./employee-listing";
import TaskScheduler from "./task-scheduler";
import useAuth from "./auth/useAuth";
import TeamMemberListing from "./team-member-listing";
import ProjectListing from "./project-listing";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    
    const { logout, user } = useAuth();

    const [employees, setEmployees] = useState([])
    const [showEmployees, setShowEmployees] = useState(false);

    const [projects, setProjects] = useState([]);
    const [showProjects, setShowProjects] = useState(false);

    const [teamMembers, setTeamMembers] = useState([])
    const [showTeamMembers, setShowTeamMembers] = useState(false);

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetchProjects()
    }, [])

    useEffect(() => {
        fetchTeamMembers()
    }, [])

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

    const fetchTeamMembers = () => {
        const token = localStorage.getItem('token');

        fetch(`${API_BASE_URL}/api/team-members`, {headers:{'Accept': 'application/json','Authorization': `Bearer ${token}`}})
          .then((res) => { console.log('Fetching employees...'); return res.json(); })
          .then((data) => setTeamMembers(data.members))
          .catch((err) => console.error(err));
    }

    const fetchProjects = () => {
        const token = localStorage.getItem('token');
    
        fetch(`${API_BASE_URL}/api/projects`, { headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}})
        .then((res) => {console.log('Fetching projects...'); return res.json();})
        .then((data) => setProjects(data.projects)) // assuming your controller returns { projects: [...] }
        .catch((err) => console.error('Error fetching projects:', err));
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
            <div className='flex w-screen justify-between items-center mb-10 px-9'>
                <div>
                    <h2 className="text-2xl font-bold">Task Manager</h2>
                </div>
                <div className="flex gap-2">
                    { !showProjects && (user.is_company_owner == 1) && (
                        <button className='text-white' onClick={() => {setShowProjects(prev => !prev); setShowEmployees(false); setShowTeamMembers(false);}} >Manage Projects</button>
                        )
                    }
                    { !showTeamMembers && (user.is_company_owner == 1) && (
                        <button className='text-white' onClick={() => {setShowTeamMembers(prev => !prev); setShowEmployees(false); setShowProjects(false);}} >Manage Team Members</button>
                        )
                    }
                    { !showEmployees && ( 
                        <button className='text-white' onClick={() => {setShowEmployees(prev => !prev); setShowTeamMembers(false); setShowProjects(false);}} >Manage Employees</button>
                        )}
                    { (showEmployees || showTeamMembers || showProjects) && ( <button className='text-white' onClick={() => {setShowEmployees(false); setShowTeamMembers(false);setShowProjects(false);}} >Home</button> )}
                    <button className='text-white' onClick={() => handleLogout()} >Logout</button>
                </div>
            </div>
            <main className="container mx-auto min-h-[700px] px-9">
            {showProjects && (
                <>
                <ProjectListing projects={projects} setProjects={setProjects} />
                </>
            )}

            {showTeamMembers && (
                <>
                <TeamMemberListing members={teamMembers} setMembers={setTeamMembers} />
                </>
            )}

            {showEmployees && (
                <>
                <EmployeeListing employees={employees} setEmployees={setEmployees} />
                </>
            )}

            {!showEmployees && !showTeamMembers && !showProjects && (
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