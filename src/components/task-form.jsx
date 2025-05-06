"use client"

import { useState, useEffect } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TaskForm({ employees, fetchEmployees}) {
  const [taskName, setTaskName] = useState("")
  //const [tasks, setTasks] = useState([])
  const [hours, setHours] = useState("")

  const [assignedToId, setAssignedToId] = useState("")

  const handleEmployeeChange = (e) => {
    setAssignedToId(e.target.value);
    // You might want to do something else with the selected employee ID here,
    // like updating a task object or triggering an API call.
    console.log('Selected Employee ID:', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTaskData = {
      name: taskName,
      hours: parseFloat(hours), // Ensure hours is a number
      assigned_to: assignedToId, // Send an array of employee IDs
      // You might have other fields to include based on your API
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might need to include an authorization token here
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(newTaskData),
      });

      if (response.ok) {
        const newTask = await response.json(); // Assuming your API returns the newly created task
        console.log('Task created:', newTask);
        //setTasks([...tasks, newTask]); // Update the local tasks state
        fetchEmployees();
        setTaskName('');
        setHours('');
        setAssignedToId('');
      } else {
        const errorData = await response.json();
        console.error('Error creating task:', errorData);
        // Handle the error, display a message to the user, etc.
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network errors
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <input placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <input placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} required type="number" 
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <select id="options" onChange={handleEmployeeChange} value={assignedToId} name="options" className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                <option value="">Assign to</option>
                { employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                )) }
            </select>
        </div>
      </div>
      <div className="flex justify-items-start">
        <button type="submit" className="w-full md:w-auto right-0 text-white">
            Add Task
        </button>
      </div>
    </form>
  )
}
