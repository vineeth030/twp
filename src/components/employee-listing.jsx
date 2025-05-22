import { useState, useEffect } from "react"
import ConfirmDeleteModal from "./ui/confirm-delete-modal"
import EmployeeEditFormModal from "./employee-edit-form";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmployeeListing({ employees, setEmployees }) {
    const [tasks, setTasks] = useState([]) 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeName, setEmployeeName] = useState("")
    const [employeeEmail, setEmployeeEmail] = useState("")
    const [employeeDesignation, setEmployeeDesignation] = useState("")

    const handleEditButtonClick = (employee) => {
        setSelectedEmployee(employee)
        setEmployeeName(employee.name)
        setEmployeeEmail(employee.email)
        setEmployeeDesignation(employee.designation)
        setIsEditModalOpen(true)
    }

    const handleDeleteButtonClick = (employee) => {
        console.log('Employee: ', employee)
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
    }

    const handleSubmit = async () => {
        console.log('Employee edit form submit : ', { employeeName, employeeEmail, employeeDesignation });

        const token = localStorage.getItem('token');

        try {
            await fetch(`${API_BASE_URL}/api/employees`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'name': employeeName,
                    'email': employeeEmail,
                    'designation' : employeeDesignation
                })
            });
            console.log('Employee deleted successfully');
            setEmployees((prev) =>
                prev.filter((emp) => emp.id !== selectedEmployee.id)
            );

        } catch (error) {
            console.error('Failed to delete employee:', error);
        }
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
        <div>
            <table className="table-auto w-full text-left mt-8">
                <thead>
                    <tr className="border-b">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        employees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                            <td>{employee.name}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <a onClick={ () => handleEditButtonClick(employee) } className="text-white cursor-pointer">Edit</a> | <a onClick={ () => handleDeleteButtonClick(employee) } className="text-white cursor-pointer">Delete</a></td>
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
                setEmployeeName={setEmployeeName}
                setEmployeeEmail={setEmployeeEmail}
                setEmployeeDesignation={setEmployeeDesignation}
                setSelectedEmployee={setSelectedEmployee}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}