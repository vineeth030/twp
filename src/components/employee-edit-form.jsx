import React from "react";
import { useState } from "react";

const EmployeeEditFormModal = ({ 
    isOpen, onClose, employeeName, employeeEmail, employeeDesignation, 
    setEmployeeName, setEmployeeEmail, setEmployeeDesignation, handleSubmit
}) => {
  if (!isOpen) return null;
//   const [name, setName] = useState(employee.name)
//   const [email, setEmail] = useState(employee.email)
//   const [designation, setDesignation] = useState(employee.designation)

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-75">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800">Edit Employee</h2>
    
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <input placeholder="Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <input placeholder="Email" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} required type="text" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <input placeholder="Designation" value={employeeDesignation} onChange={(e) => setEmployeeDesignation(e.target.value)} required type="text" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <button type="submit" onClick={onClose} className="w-full md:w-auto right-0 text-white">
                    Cancel
                </button>
                <button type="submit" onClick={handleSubmit} className="w-full md:w-auto right-0 text-white">
                    Save
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

export default EmployeeEditFormModal;
