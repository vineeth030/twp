import React, { useState, useEffect } from "react";

const EmployeeEditFormModal = ({ 
    isOpen, onClose, employeeName, employeeEmail, employeeDesignation, employeeHourlyRate,
    setEmployeeName, setEmployeeEmail, setEmployeeDesignation, setEmployeeHourlyRate, handleSubmit
}) => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    designation: '',
    hourlyRate: ''
  });

  useEffect(() => {
    // Reset errors when modal opens
    if (isOpen) {
      setErrors({
        name: '',
        email: '',
        designation: '',
        hourlyRate: ''
      });
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      designation: '',
      hourlyRate: 0
    };
    let isValid = true;

    // Name validation
    if (!employeeName.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (employeeName.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Email validation
    if (!employeeEmail.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeEmail.trim())) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Designation validation
    if (!employeeDesignation.trim()) {
      newErrors.designation = 'Designation is required';
      isValid = false;
    } else if (employeeDesignation.trim().length < 2) {
      newErrors.designation = 'Designation must be at least 2 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-75">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-1">Edit Employee</h2>
        <hr className="border-t border-gray-300 mb-5" />    
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Employee Name</label>
                <input 
                    placeholder="Name" 
                    value={employeeName} 
                    onChange={(e) => {
                        setEmployeeName(e.target.value);
                        if (errors.name) {
                            setErrors(prev => ({ ...prev, name: '' }));
                        }
                    }}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Employee Email</label>
                <input 
                    placeholder="Email" 
                    value={employeeEmail} 
                    onChange={(e) => {
                        setEmployeeEmail(e.target.value);
                        if (errors.email) {
                            setErrors(prev => ({ ...prev, email: '' }));
                        }
                    }}
                    type="email"
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Employee Designation</label>
                <input 
                    placeholder="Designation" 
                    value={employeeDesignation} 
                    onChange={(e) => {
                        setEmployeeDesignation(e.target.value);
                        if (errors.designation) {
                            setErrors(prev => ({ ...prev, designation: '' }));
                        }
                    }}
                    className={`w-full px-4 py-2 border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.designation && <p className="mt-1 text-sm text-red-500">{errors.designation}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                <input 
                    placeholder="Hourly Rate" 
                    value={employeeHourlyRate} 
                    onChange={(e) => {
                        setEmployeeHourlyRate(e.target.value);
                        if (errors.hourlyRate) {
                            setErrors(prev => ({ ...prev, hourlyRate: '' }));
                        }
                    }}
                    className={`w-full px-4 py-2 border ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.hourlyRate && <p className="mt-1 text-sm text-red-500">{errors.hourlyRate}</p>}
            </div>
        </div>
        <div className="flex justify-end gap-1 mt-5">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
                Cancel
            </button>
            <button 
                onClick={handleFormSubmit} 
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
                Save
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditFormModal;
