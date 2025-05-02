import { useState, useEffect } from "react"

export default function EmployeeListing({ employees }) {
    const [tasks, setTasks] = useState([]) 

    return (
        <div>
            <table class="table-auto w-full text-left mt-8">
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
                            <tr className="border-b">
                        <td>{employee.name}</td>
                        <td>-</td>
                        <td>-</td>
                        <td><a className="text-white">Edit</a> | <a className="text-white">Delete</a></td>
                        </tr>
                    ))
                    }
                    
                </tbody>
            </table>
        </div>
    )
}