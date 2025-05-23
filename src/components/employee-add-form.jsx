import React from "react";

const EmployeeAddFormModal = ({ 
    isOpen, onClose, employeeName, employeeEmail, employeeDesignation, 
    setEmployeeName, setEmployeeEmail, setEmployeeDesignation, handleSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-75">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-l font-semibold text-gray-800 pb-5">Add Employee</h2>    
        <div className="grid grid-cols-1 gap-4">
            <div>
                <input placeholder="Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <input placeholder="Email" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <input placeholder="Designation" value={employeeDesignation} onChange={(e) => setEmployeeDesignation(e.target.value)} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="flex justify-end gap-1 mt-5">
            <button type="submit" onClick={onClose} className="w-full md:w-auto right-0 text-white">
                Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="w-full md:w-auto right-0 text-white">
                Save
            </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeAddFormModal;
