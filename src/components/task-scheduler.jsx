import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, TimelineViews, Inject, ResourcesDirective, ResourceDirective, Resize, DragAndDrop, TimelineMonth, Day } from '@syncfusion/ej2-react-schedule';
import './timeline-resources.css';
import { extend } from '@syncfusion/ej2-base';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { registerLicense } from '@syncfusion/ej2-base';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdEVjUHpZcXZRR2lbWkZ/')

export default function TaskScheduler({ employees, tasks, projects }) {
    const scheduleObj = useRef(null);

    const data = extend([], tasks, null, true);

    const getEmployeeName = (value) => {
        return value.resourceData[value.resource.textField];
    };
    const getEmployeeDesignation = (value) => {
        return value.resourceData.designation;
    };
    const getEmployeeHours = (value) => {
        return value.resourceData.hours;
    };

    const resourceHeaderTemplate = (props) => {
        return (<div className="template-wrap">
                <div className="employee-category">
                    <div className="employee-name"> {getEmployeeName(props)}</div>
                    <div className="employee-designation">{getEmployeeDesignation(props)}</div>
                    <div className="employee-hours">{getEmployeeHours(props)}</div>
                </div>
            </div>);
    };

    const dateHeaderTemplate = (props) => {
        const date = new Date(props.date);
        const dayName = date.toLocaleString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
        const dayNumber = date.getDate(); // 1, 2, 3, etc.
        const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday = 0, Saturday = 6
        return (
            <div 
                className={`custom-date-header text-center ${
                    isWeekend ? 'weekend-header' : ''
                }`}
            >
                <div>{dayName}</div>
                <div>{dayNumber}</div>
            </div>
        );
    };
    
    const handleActionBegin = async ( args ) => {

        console.log('Event type:', args.requestType);
        console.log('Event data:', args.data);

        // Add project_name before saving
        if (args.data && args.data.project_id) {
            const selectedProject = projects.find(p => p.id === args.data.project_id);
            if (selectedProject) {
                args.data.project_name = selectedProject.name;
            }
        }

        if (args.requestType === 'eventRemove') {
            deleteTask(args.data);
        }

        if (args.requestType === 'eventChange') {
            updateTask(args.data);
        }
        
        if (args.requestType === 'eventCreate') {

            let data = await calculateHoursInATask(args.data[0])
            console.log('Create Task Data: ', args.data[0])
            console.log('After calculate: ', data)
            createTask(data);
        }
    }

    const calculateHoursInATask = (eventData) => {
        const startDate = new Date(eventData.start_at);
        const endDate = new Date(eventData.end_at);

        // Working hours definition
        const WORK_DAY_START_HOUR = 9;
        const WORK_DAY_END_HOUR = 17;
        const WORK_DAY_HOURS = WORK_DAY_END_HOUR - WORK_DAY_START_HOUR;

        const isWorkingDay = (date) => {
            const day = date.getDay();
            return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
        };

        let totalWorkingHours = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            if (isWorkingDay(currentDate)) {
                if (currentDate.toDateString() === startDate.toDateString()) {
                    // First day
                    const startHour = Math.max(startDate.getHours() + startDate.getMinutes() / 60, WORK_DAY_START_HOUR);
                    const endHour = WORK_DAY_END_HOUR;
                    totalWorkingHours += Math.max(0, Math.min(endHour, WORK_DAY_END_HOUR) - startHour);
                } else if (currentDate.toDateString() === endDate.toDateString()) {
                    // Last day
                    const startHour = WORK_DAY_START_HOUR;
                    const endHour = Math.min(endDate.getHours() + endDate.getMinutes() / 60, WORK_DAY_END_HOUR);
                    totalWorkingHours += Math.max(0, endHour - startHour);
                } else {
                    // Full working day in between
                    totalWorkingHours += WORK_DAY_HOURS;
                }
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(0, 0, 0, 0); // Reset time to midnight
        }

        console.log(`Total working hours: ${totalWorkingHours}`);

        // Optional: add to your eventData
        eventData.totalWorkingHours = totalWorkingHours;

        return eventData;
    }

    const deleteTask = async (data) => {

        const token = localStorage.getItem('token');
        const deletedTask = data; // can be an array or object
        const taskId = Array.isArray(deletedTask) ? deletedTask[0].id : deletedTask.id;
    
        try {
            await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }

    }

    const updateTask = async (task) => {
        const token = localStorage.getItem('token');
        console.log('updateTask', task);
        try {
            await fetch(`${API_BASE_URL}/api/tasks`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });
            console.log('Task updated successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }

    }

    const createTask = async (task) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });
            console.log('Task created successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    }

    // const handleOnAddTask = () => {
    //     console.log('handleOnAddTask');
    //     const date = scheduleObj.current.selectedDate;

    //     const cellData = {
    //         Id: scheduleObj.current.getEventMaxID(),
    //         Subject: '',
    //         StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
    //         EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
    //         IsAllDay: false
    //       };
      
    //     scheduleObj.current.openEditor(cellData, 'Add');
    // }

    const handleRenderCell = (args) => {
        if (args.elementType === 'emptyCells' || args.elementType === 'resourceHeaderCells') {
            //const cellDate = new Date(args.data.date);
            //const day = cellDate.getDay();
            // if (day === 0 || day === 6) {
            //     args.element.classList.add('weekend-disabled');
            // } else {
            //     args.element.classList.add('workday-highlight');
            // }
        }
    };

    const handlePopupOpen = (args) => {
        if (args.type === 'QuickInfo') {
          args.cancel = true; // prevent quick popup
          scheduleObj.current.openEditor(args.data, args.target.classList.contains('e-appointment') ? 'Save' : 'Add');
        }

        // if (args.type === 'Editor') {
        //     setTimeout(() => {
        //       const dialog = document.querySelector('.e-schedule-dialog .e-dlg-header');
        //       if (dialog) {
        //         dialog.textContent = args.data.Id ? 'Edit Booking' : 'New Booking';
        //       }
        //     }, 0);
        //   }
      };

    const EventTemplate = (props) => {
        return (
          <div style={{ padding: '1px' }}>
            <div><strong>{props.project_name}</strong></div>
            <div>{props.name}</div>
          </div>
        );
    };
      

    const editorTemplate = (props) => {

        return (
          <div className="custom-event-editor">
            <div className="form-group">
              <label>Project</label>
              <DropDownListComponent
                    dataSource={projects}
                    fields={{ text: 'name', value: 'id' }}
                    value={props.project_id || ''}
                    name="project_id"
                    className="e-field"
                    placeholder="Select Project"
                />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                className="e-field e-input"
                type="text"
                name="name"
                defaultValue={props.Subject || ''}
              />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <DateTimePickerComponent
                value={props.StartTime || new Date()}
                format="dd/MM/yy hh:mm a"
                name="start_at"
                className="e-field"
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <DateTimePickerComponent
                value={props.EndTime || new Date()}
                format="dd/MM/yy hh:mm a"
                name="end_at"
                className="e-field"
              />
            </div>
            <div className="form-group">
              <label>Employee</label>
              <DropDownListComponent
                dataSource={employees}
                fields={{ text: 'name', value: 'id' }}
                value={props.EmployeeId || props.employee_id} // adapt depending on your data
                name="employee_id" // match the field in your event model
                className="e-field"
                placeholder="Select Employee"
              />
            </div>
          </div>
        );
      };
      

    return (<div className='schedule-control-section'>
        {/* <div className='flex justify-end'>
            <button id="addEventBtn" className='text-white mb-1' onClick={handleOnAddTask}>Add Task</button>
        </div> */}
        <div className='col-lg-12 control-section'>
            <div className='control-wrapper drag-sample-wrapper'>
                <div className="schedule-container">
                    <ScheduleComponent cssClass='block-events' width='100%' startHour='08:00' endHour='20:00' 
                        selectedDate={new Date()}
                        ref={scheduleObj} 
                        currentView='TimelineMonth'
                        dateHeaderTemplate={dateHeaderTemplate} 
                        resourceHeaderTemplate={resourceHeaderTemplate}
                        editorTemplate={editorTemplate}
                        renderCell={handleRenderCell}
                        workDays={[1, 2, 3, 4, 5]}
                        rowAutoHeight={true}
                        eventSettings={{ dataSource: data, template: EventTemplate, fields: {
                            id: 'id',
                            subject: { name: 'name' },
                            startTime: { name: 'start_at' },
                            endTime: { name: 'end_at' },
                            isAllDay: { name: 'is_all_day' },
                            projectId: { name: 'project_id' },
                            projectName: {name: 'project_name' } 
                        }}} 
                        actionBegin={handleActionBegin}
                        popupOpen={handlePopupOpen}
                        group={{ enableCompactView: false, resources: ['Employee'] }}>
                        <ResourcesDirective>
                            <ResourceDirective field='employee_id' title='Employees' name='Employee' allowMultiple={true} dataSource={employees} textField='name' idField='id' colorField='Color'/>
                        </ResourcesDirective>
                        <ViewsDirective>
                            <ViewDirective option='TimelineMonth'/>
                        </ViewsDirective>
                        <Inject services={[TimelineMonth, Resize, DragAndDrop]}/>
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    </div>);
}