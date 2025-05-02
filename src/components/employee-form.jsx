"use client"

import { useState, useEffect } from "react"

export default function EmployeeForm({ employees }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [designation, setDesignation] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEmployeeData = {
      name: taskName,
      email: parseFloat(hours),
    };

    console.log('Add new employee');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required type="text" 
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required type="text" 
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex justify-items-start">
        <button type="submit" className="w-full md:w-auto right-0 text-white">
            Add Employee
        </button>
      </div>
    </form>
  )
}
