import { DatePickerComponent } from "@syncfusion/ej2-react-calendars"
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResourceUtilization() {
    const [employeesResourceUtilization, setEmployeesResourceUtilization] = useState([])

    useEffect(() => {
        console.log('flag 1');
        fetchEmployeeResourceUtilization()
    }, [])

    console.log('flag 2');

    const dateValue = new Date();
    const dateEndOfThisMonth = new Date(dateValue.getFullYear(), dateValue.getMonth() + 1, 0);

    const fetchEmployeeResourceUtilization = async () => {

        console.log('flag 3');
        
        const token = localStorage.getItem('token');

        console.log('Data: ', {
            'name': dateValue,
            'email': dateEndOfThisMonth
        });

        const response = await fetch(`${API_BASE_URL}/api/resource-utilization`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'from_date': dateValue,
                'to_date': dateEndOfThisMonth
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update employee');
        }
        
        const employeeResourceUtilization = await response.json();

        console.log('Resource data: ', employeeResourceUtilization.employees);

        setEmployeesResourceUtilization(employeeResourceUtilization.employees);
    } 

    return (
        <div className="overflow-x-auto pt-5">
            <h1 className="pb-10">Resource Utilization</h1>
            <div className="flex gap-5 mb-2">
                <DatePickerComponent id="fromDate" value={dateValue} placeholder="From date" />
                <DatePickerComponent id="fromDate" value={dateEndOfThisMonth} placeholder="To date" />
            </div>
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr className="border-b">
                    <th className="px-2 py-3 border-b">Employee</th>
                    <th className="px-2 py-3 border-b">Available Hours</th>
                    <th className="px-2 py-3 border-b">Billable Hours</th>
                    <th className="px-2 py-3 border-b">Non Billable Hours</th>
                </tr>
                </thead>
                <tbody>
                    {
                        employeesResourceUtilization.map(employee => (
                            <tr key={employee.employee_id} className="border-b">
                                <th className="px-2 py-2 font-medium text-gray-700 bg-gray-50">{employee.employee_name}</th>
                                <td className="px-2 py-2">{employee.available_hours}</td>
                                <td className="px-2 py-2">{employee.billable_hours}</td>
                                <td className="px-2 py-2">{employee.non_billable_hours}</td>
                            </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>

    )
}