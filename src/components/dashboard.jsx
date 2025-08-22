import { useState, useEffect } from "react"
import EmployeeListing from "./employee-listing";
import ResourceUtilization from "./resource-utilization";
import TaskScheduler from "./task-scheduler";
import useAuth from "./auth/useAuth";
import TeamMemberListing from "./team-member-listing";
import ProjectListing from "./project-listing";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import Profile from "./profile";
import Settings from "./settings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([])
    const [showEmployees, setShowEmployees] = useState(false);

    const [showResourceUtilization, setShowResourceUtilization] = useState(false);

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
        if (success) navigate("/login");
    }

    const fetchTeamMembers = () => {
        const token = localStorage.getItem('token');

        fetch(`${API_BASE_URL}/api/team-members`, {headers:{'Accept': 'application/json','Authorization': `Bearer ${token}`}})
          .then((res) => { return res.json(); })
          .then((data) => setTeamMembers(data.members))
          .catch((err) => console.error(err));
    }

    const fetchProjects = () => {
        const token = localStorage.getItem('token');
    
        fetch(`${API_BASE_URL}/api/projects`, { headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}})
        .then((res) => { return res.json();})
        .then((data) => setProjects(data.projects)) // assuming your controller returns { projects: [...] }
        .catch((err) => console.error('Error fetching projects:', err));
    }

    const fetchEmployees = () => {
        const token = localStorage.getItem('token');

        fetch(`${API_BASE_URL}/api/employees`, {headers:{'Accept': 'application/json','Authorization': `Bearer ${token}`}})
          .then((res) => { return res.json(); })
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
            <div className='flex w-screen justify-between items-center mb-10'>
                <nav class="bg-white shadow-md px-6 py-2 w-screen flex items-center justify-between">
                    <div class="flex items-center space-x-6 ml-4">
                        <div class="text-xl font-bold text-gray-800">Task Manager</div>
                        <div class="flex space-x-4">
                            <NavLink to="/"
                                className={({ isActive }) =>
                                    isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                }
                            >Home</NavLink>
                            {user.is_company_owner == 1 && (
                            <>
                                <NavLink to="/dashboard/projects"
                                    className={({ isActive }) =>
                                        isActive
                                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }
                                >Projects</NavLink>
                                <NavLink to="/dashboard/managers"
                                    className={({ isActive }) =>
                                        isActive
                                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }
                                >Managers</NavLink>
                            </>
                            )}
                            <NavLink to="/dashboard/employees"
                                className={({ isActive }) =>
                                    isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                }
                            >Employees</NavLink>
                            <NavLink to="/dashboard/resource-utilization"
                                className={({ isActive }) =>
                                    isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                }
                            >Resource Utilization</NavLink>
                        </div>
                    </div>

                    <div class="relative group p-5">
                        <div class="flex items-center space-x-2 cursor-pointer">
                            <span class="text-gray-700 font-medium">{user.name}</span>
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <div class="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200 z-50">
                            {/* <a href="/profile" class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a> */}
                            <Link to="/dashboard/profile" className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                            <Link to="/dashboard/settings" className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                            <button href="#" onClick={() => handleLogout()} class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                </nav>
            </div>

            <main className="mx-10 min-h-[700px]">
                <Routes>
                    <Route path="/" element={<TaskScheduler employees={employees} tasks={tasks} projects={projects} setTasks={setTasks} />} />
                    <Route path="/dashboard/projects" element={<ProjectListing projects={projects} employees={employees} setProjects={setProjects} setTasks={setTasks} />} />
                    <Route path="/dashboard/managers" element={<TeamMemberListing members={teamMembers} setMembers={setTeamMembers} />} />
                    <Route path="/dashboard/employees" element={<EmployeeListing employees={employees} setEmployees={setEmployees} />} />
                    <Route path="/dashboard/resource-utilization" element={<ResourceUtilization />} />
                    <Route path='/dashboard/profile' element={<Profile />} />
                    <Route path='/dashboard/settings' element={<Settings />} />
                </Routes>
            </main>
        </>
    )
}