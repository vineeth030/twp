import { DatePickerComponent } from "@syncfusion/ej2-react-calendars"
import { useEffect, useState } from "react";
import HorizontalBarChart from "./charts/resource-chart";
import { registerLicense } from '@syncfusion/ej2-base';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdEVjUHpZcXZRR2lbWkZ/')

export default function ResourceUtilization() {
    const [employeesResourceUtilization, setEmployeesResourceUtilization] = useState([])
    const [barChartData, setBarChartData] = useState(false)
    const [maxValue, setMaxValue] = useState(0)

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    );

    useEffect(() => {
        fetchEmployeeResourceUtilization(fromDate, toDate)
    }, [fromDate, toDate])

    const fetchEmployeeResourceUtilization = async (startDate, endDate) => {
        
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/api/resource-utilization`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'from_date': startDate,
                'to_date': endDate
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update employee');
        }
        
        const employeeResourceUtilization = await response.json();

        setBarChartData({
            labels: employeeResourceUtilization.employeeNames,
            datasets: [
              {
                label: 'Billable',
                data: employeeResourceUtilization.billableTotalHours,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderRadius: 5,
              },
              {
                label: 'Non billable',
                data: employeeResourceUtilization.nonBillableTotalHours,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderRadius: 5,
              }
            ],
        })

        setMaxValue(employeeResourceUtilization.availableHours)

        setEmployeesResourceUtilization(employeeResourceUtilization.employees);
    } 

    return (
        <>
            <h1 className="ml-5">Resource Utilization</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
            
            {/* Table */}
            <div className="overflow-x-auto pt-5">
                <div className="flex gap-5 mb-2">
                    <DatePickerComponent change={(e) => setFromDate(e.value)} value={fromDate}  id="fromDate" placeholder="From date" />
                    <DatePickerComponent change={(e) => setToDate(e.value)} value={toDate} id="fromDate" placeholder="To date" />
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

            {/* Chart */}
            <div className="flex items-center justify-center">
                { barChartData && <HorizontalBarChart data={barChartData} maxValue={maxValue} />}
            </div>


        </div>
        </>
        

    )
}