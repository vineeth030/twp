import { useState, useEffect } from "react"

export default function TaskListing({ employees, fetchEmployees }) {
    const [tasks, setTasks] = useState([]) 

    useEffect(() => {
        fetch('http://localhost:8000/api/tasks')
          .then((res) => res.json())
          .then((data) => setTasks(data.tasks))
          .catch((err) => console.error(err));

      }, []);

    const handleOnClick = () => {
      alert('on click');
    }

    const handleTaskDrop = async (e, employee) => {
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
                // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: JSON.stringify(draggedTaskData),
            });
      
            if (response.ok) {
              const newTask = await response.json(); // Assuming your API returns the newly created task
              fetchEmployees()
            } else {
              const errorData = await response.json();
              console.error('Error creating task:', errorData);
            }
          } catch (error) {
            console.error('Network error:', error);
          }
    }

    return (
        <div>
            <div className="text-left">
              { 
                employees.map((employee) => (
                  <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleTaskDrop(e, employee)} key={employee.id} className="border border-gray-400 shadow mt-2 p-2">
                    {employee.name} {employee.task && ( <span draggable onDragStart={(e) => {
                                    console.log(`Dragging from employee ID: ${employee.id}`);
                                    e.dataTransfer.setData("fromEmployeeId", employee.id.toString());
                                    e.dataTransfer.setData("taskId", employee.task.id.toString());
                                  }} className="bg-blue-500 rounded-xs border shadow p-2 text-sm mx-1">
                      {employee.task.name} | {employee.task.hours} hours
                      </span> )}
                  </div>
                ))
              }
            </div>
        </div>
    )
}