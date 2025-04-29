import { useState, useEffect } from "react"

interface Task {
    id: number,
    name: string,
    hours: number
}

interface Employee {
    id: number,
    name: string,
    task: Task
}

export default function TaskListing() {
    const [draggingTaskId, setDraggingTaskId] = useState(0)
    const [tasks, setTasks] = useState<Task[]>([]) 
    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect(() => {
        fetch('http://localhost:8000/api/employees')
          .then((res) => res.json())
          .then((data) => setEmployees(data.employees))
          .catch((err) => console.error(err));

        fetch('http://localhost:8000/api/tasks')
          .then((res) => res.json())
          .then((data) => setTasks(data.tasks))
          .catch((err) => console.error(err));

      }, []);

    const handleTaskDrop = async (e: any, employee: Employee) => {
        const draggedFromId = e.dataTransfer.getData("fromEmployeeId");
        const draggedTaskId = e.dataTransfer.getData("taskId");
        const fromId = parseInt(draggedFromId, 10);
        const taskId = parseInt(draggedTaskId, 10);

        if (fromId === employee.id) return; // Don't drop on self

        
        const draggedTaskData = {
            assigned_to: employee.id,
            task_id: taskId
        };

        try {
            const response = await fetch('http://localhost:8000/api/tasks/reassign', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // You might need to include an authorization token here
                // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: JSON.stringify(draggedTaskData),
            });
      
            if (response.ok) {
              const newTask = await response.json(); // Assuming your API returns the newly created task
              console.log('Task created:', newTask);
              //setTasks([...tasks, newTask]); // Update the local tasks state
            } else {
              const errorData = await response.json();
              console.error('Error creating task:', errorData);
              // Handle the error, display a message to the user, etc.
            }
          } catch (error) {
            console.error('Network error:', error);
            // Handle network errors
          }

        setEmployees((prev) => {
          const fromEmp = prev.find((emp) => emp.id === fromId);
          if (!fromEmp || !fromEmp.task) return prev;

          return prev.map((emp) => {
            if (emp.id === fromId) return { ...emp, task: null };
            if (emp.id === employee.id) return { ...emp, task: fromEmp.task };
            return emp;
          });
        });
    }

    return (
        <div>
            <div className="flex gap-2 mt-2">
                {
                    employees.map((employee) => (
                        <div onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleTaskDrop(e, employee)}
                         key={employee.id} className="flex-1 aspect-square border-1 border-gray-300">
                            <p className="text-left p-2">{employee.name}</p>
                            {employee.task && (
                                <div draggable onDragStart={(e) => {
                                    console.log(`Dragging from employee ID: ${employee.id}`);
                                    e.dataTransfer.setData("fromEmployeeId", employee.id.toString());
                                    e.dataTransfer.setData("taskId", employee.task.id.toString());
                                  }} className="bg-gray-100 rounded-xs border shadow p-2 text-sm mx-1">
                                    <h6 className="font-semibold">{employee.task.name}</h6>
                                    {employee.task.hours && <span className="text-gray-600">{employee.task.hours} hours</span>}
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}