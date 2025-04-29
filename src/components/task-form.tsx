"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function TaskForm() {
  const [taskName, setTaskName] = useState("")
  const [hours, setHours] = useState("")
  const [employee, setEmployee] = useState("")

  useEffect(() => {
    fetch('http://localhost:8000/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ taskName, hours, employee })
    // Here you would typically add the task to your task list
    setTaskName("")
    setHours("")
    setEmployee("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <input placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} required type="number" 
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <select id="options" value={employee} onChange={(e) => setEmployee(e.target.value)} name="options" className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                <option value="">Assign to</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
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
