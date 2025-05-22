import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, TimelineViews, Inject, ResourcesDirective, ResourceDirective, Resize, DragAndDrop, TimelineMonth, Day } from '@syncfusion/ej2-react-schedule';
import './timeline-resources.css';
import { extend } from '@syncfusion/ej2-base';

import { registerLicense } from '@syncfusion/ej2-base';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdEVjUHpZcXZRR2lbWkZ/')

export default function TaskScheduler({ employees, tasks }) {
    const scheduleObj = useRef(null);

    const data = extend([], tasks, null, true);

    const getEmployeeName = (value) => {
        return value.resourceData[value.resource.textField];
    };
    const getEmployeeDesignation = (value) => {
        return value.resourceData.designation;
    };
    const resourceHeaderTemplate = (props) => {
        return (<div className="template-wrap">
                <div className="employee-category">
                    <div className="employee-name"> {getEmployeeName(props)}</div>
                    <div className="employee-designation">{getEmployeeDesignation(props)}</div>
                </div>
            </div>);
    };
    const handleActionBegin = async ( args ) => {
        console.log('Event type:', args.requestType);
        console.log('Event data:', args.data);
        if (args.requestType === 'eventRemove') {
            deleteTask(args.data);
        }

        if (args.requestType === 'eventChange') {
            updateTask(args.data);
        }
        
        if (args.requestType === 'eventCreate') {
            createTask(args.data[0]);
        }
    }

    const deleteTask = async (data) => {

        const deletedTask = data; // can be an array or object
        const taskId = Array.isArray(deletedTask) ? deletedTask[0].id : deletedTask.id;
    
        try {
            await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }

    }

    const updateTask = async (task) => {
        try {
            await fetch(`${API_BASE_URL}/api/tasks`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }

    }

    const createTask = async (task) => {
        try {
            await fetch(`${API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    }

    const getEventData = () => {
        const date = scheduleObj.current.selectedDate;
        return {
            Id: scheduleObj.current.getEventMaxID(),
            Subject: '',
            StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
            EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
            Location: '',
            Description: '',
            IsAllDay: false,
            CalendarId: 1
        };
    };

    const handleOnAddTask = () => {
        console.log('handleOnAddTask');
        const date = scheduleObj.current.selectedDate;

        const cellData = {
            Id: scheduleObj.current.getEventMaxID(),
            Subject: '',
            StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
            EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
            IsAllDay: false
          };
      
        scheduleObj.current.openEditor(cellData, 'Add');
    }

    return (<div className='schedule-control-section'>
        <div className='flex justify-end'>
            <button id="addEventBtn" className='text-white mb-1' onClick={handleOnAddTask}>Add Task</button>
        </div>
        <div className='col-lg-12 control-section'>
            <div className='control-wrapper drag-sample-wrapper'>
                <div className="schedule-container">
                    <ScheduleComponent cssClass='block-events' width='100%' height='650px' startHour='08:00' endHour='20:00' 
                        selectedDate={new Date(2025, 4, 11)}
                        ref={scheduleObj} 
                        currentView='TimelineDay' 
                        resourceHeaderTemplate={resourceHeaderTemplate} 
                        eventSettings={{ dataSource: data, fields: {
                            id: 'id',
                            subject: { name: 'name' },
                            startTime: { name: 'start_at' },
                            endTime: { name: 'end_at' },
                            isAllDay: { name: 'is_all_day' }
                        }}} 
                        actionBegin={handleActionBegin}
                        group={{ enableCompactView: false, resources: ['Employee'] }}>
                        <ResourcesDirective>
                            <ResourceDirective field='employee_id' title='Employees' name='Employee' allowMultiple={true} dataSource={employees} textField='name' idField='id' colorField='Color'/>
                        </ResourcesDirective>
                        <ViewsDirective>
                            <ViewDirective option='Day'/>
                            <ViewDirective option='TimelineDay'/>
                            <ViewDirective option='TimelineMonth'/>
                        </ViewsDirective>
                        <Inject services={[Day, TimelineViews, TimelineMonth, Resize, DragAndDrop]}/>
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    </div>);
}