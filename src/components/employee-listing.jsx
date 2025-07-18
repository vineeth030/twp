import { useState, useEffect } from "react"
import ConfirmDeleteModal from "./ui/confirm-delete-modal"
import EmployeeEditFormModal from "./employee-edit-form";
import EmployeeAddFormModal from "./employee-add-form";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmployeeListing({ employees, setEmployees, setShowEmployee, setShowEmployees, setEmployee }) {
    const [tasks, setTasks] = useState([]) 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeName, setEmployeeName] = useState("")
    const [employeeEmail, setEmployeeEmail] = useState("")
    const [employeeDesignation, setEmployeeDesignation] = useState("")
    const [employeeHourlyRate, setEmployeeHourlyRate] = useState("")

    const handleEditButtonClick = (employee) => {
        setSelectedEmployee(employee)
        setEmployeeName(employee.name)
        setEmployeeEmail(employee.email)
        setEmployeeDesignation(employee.designation)
        setEmployeeHourlyRate(employee.hourly_rate)
        setIsEditModalOpen(true)
    }

    const handleAddButtonClick = () => {
        setIsAddModalOpen(true)
    }

    const handleDeleteButtonClick = (employee) => {
        console.log('Employee: ', employee)
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
    }

    const handleViewButtonClick = (employee) => {
        console.log('View Employee!!');
        setShowEmployees(false);
        setShowEmployee(true);
        setEmployee(employee);
    }

    const handleAddFormSubmit = async () => {
        console.log('Employee edit form submit : ', { employeeName, employeeEmail, employeeDesignation, employeeHourlyRate });

        if (!employeeName || !employeeEmail || !employeeDesignation) {
            console.error('All fields are required');
            return;
        }

        const token = localStorage.getItem('token');

        console.log('Data: ', {
            'name': employeeName,
            'email': employeeEmail,
            'designation' : employeeDesignation,
            'hourlyRate': employeeHourlyRate
        });

        const response = await fetch(`${API_BASE_URL}/api/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'name': employeeName,
                'email': employeeEmail,
                'designation' : employeeDesignation,
                'hourly_rate': employeeHourlyRate
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update employee');
        }
        
        const newEmployeeData = await response.json();
        console.log('Employee updated successfully');

        setEmployees((prev) => [...prev, newEmployeeData.employee]);

        setEmployeeName('');
        setEmployeeEmail('');
        setEmployeeDesignation('');
        setIsAddModalOpen(false);
    }

    const handleEditFormSubmit = async () => {
        console.log('Employee edit form submit : ', { employeeName, employeeEmail, employeeDesignation, employeeHourlyRate });

        if (!employeeName || !employeeEmail || !employeeDesignation) {
            console.error('All fields are required');
            return;
        }

        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/api/employees/${selectedEmployee.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'name': employeeName,
                'email': employeeEmail,
                'designation' : employeeDesignation,
                'hourly_rate': employeeHourlyRate
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update employee');
        }
        
        console.log('Employee updated successfully');

        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === selectedEmployee.id
                  ? { ...emp, name: employeeName, email: employeeEmail, designation: employeeDesignation, hourly_rate: employeeHourlyRate }
                  : emp
            )
        );

        setSelectedEmployee(null);
        setIsEditModalOpen(false);
    }

    const handleConfirmDelete = async () => {
        // Your delete logic here
        console.log("Deleting employee:", selectedEmployee.name);
    
        setIsDeleteModalOpen(false);
        setSelectedEmployee(null);

        const token = localStorage.getItem('token');

        try {
            await fetch(`${API_BASE_URL}/api/employees/${selectedEmployee.id}`, {
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Employee deleted successfully');
            setEmployees((prev) =>
                prev.filter((emp) => emp.id !== selectedEmployee.id)
            );

        } catch (error) {
            console.error('Failed to delete employee:', error);
        }
      };

    return (
        <div class="overflow-x-auto pt-5">
            <h1>Employees</h1>
            <div className="flex justify-end mb-2">
                <button onClick={ () => handleAddButtonClick() } className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Add Employee</button>
            </div>
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr className="border-b">
                    <th class="px-2 py-3 border-b">Name</th>
                    <th class="px-2 py-3 border-b">Email</th>
                    <th class="px-2 py-3 border-b">Designation</th>
                    <th class="px-2 py-3 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        employees.map((employee) => (
                        <tr key={employee.id} className="bg-white hover:bg-gray-50">
                            <td className="px-2 py-2 border-b">{employee.name}</td>
                            <td className="px-2 py-2 border-b">{employee.email}</td>
                            <td className="px-2 py-2 border-b">{employee.designation}</td>
                            <td className="px-2 py-1 border-b flex gap-2">
                                <button onClick={ () => handleViewButtonClick(employee) } className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">View</button> 
                                <button onClick={ () => handleEditButtonClick(employee) } className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                                <button onClick={ () => handleDeleteButtonClick(employee) } className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                            </td>
                        </tr>
                    ))
                    }
                    
                </tbody>
            </table>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                employeeName={selectedEmployee?.name}
            />

            <EmployeeEditFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                employeeName={employeeName}
                employeeEmail={employeeEmail}
                employeeDesignation={employeeDesignation}
                employeeHourlyRate={employeeHourlyRate}
                setEmployeeName={setEmployeeName}
                setEmployeeEmail={setEmployeeEmail}
                setEmployeeDesignation={setEmployeeDesignation}
                setEmployeeHourlyRate={setEmployeeHourlyRate}
                setSelectedEmployee={setSelectedEmployee}
                handleSubmit={handleEditFormSubmit}
            />

            <EmployeeAddFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                employeeName={employeeName}
                employeeEmail={employeeEmail}
                employeeDesignation={employeeDesignation}
                setEmployeeName={setEmployeeName}
                setEmployeeEmail={setEmployeeEmail}
                setEmployeeDesignation={setEmployeeDesignation}
                setSelectedEmployee={setSelectedEmployee}
                handleSubmit={handleAddFormSubmit}
            />
        </div>
    )
}