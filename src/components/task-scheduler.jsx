import * as React from 'react';
import { useEffect } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, TimelineViews, Inject, ResourcesDirective, ResourceDirective, Resize, DragAndDrop, TimelineMonth, Day } from '@syncfusion/ej2-react-schedule';
import './timeline-resources.css';
import * as dataSource from './datasource.json';
import { extend } from '@syncfusion/ej2-base';

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCe0x3Qnxbf1x1ZFdMY1xbRHNPMyBoS35Rc0VmWH9ecndVRmVUVEBxVEBU')

export default function TaskScheduler(params) {
    const tasks = [
        {
            "id": 9,
            "name": "Client Meeting",
            "start_at": "2025-05-11T02:30:00.000Z",
            "end_at": "2025-05-11T05:00:00.000Z",
            "is_all_day": false,
            "employee_id": 3
        },
        {
            "id": 14,
            "name": "Meeting",
            "start_at": "2025-05-11T03:30:00.000Z",
            "end_at": "2025-05-11T05:30:00.000Z",
            "is_all_day": false,
            "employee_id": 1
        },
        {
            "id": 15,
            "name": "Quality Analysis",
            "start_at": "2025-05-11T03:30:00.000Z",
            "end_at": "2025-05-11T04:30:00.000Z",
            "is_all_day": false,
            "employee_id": 2
        },
        {
            "id": 16,
            "name": "Partners Meeting",
            "start_at": "2025-05-11T05:30:00.000Z",
            "end_at": "2025-05-11T07:30:00.000Z",
            "is_all_day": false,
            "employee_id": 4
        }
    ];
    const data = extend([], tasks, null, true);
    const employeeData = [
        { name: 'Alice', id: 1, group_id: 1, color: '#bbdc00', designation: 'Content writer' },
        { name: 'Nancy', id: 2, group_id: 1, color: '#9e5fff', designation: 'Designer' },
        { name: 'Robert', id: 3, group_id: 1, color: '#bbdc00', designation: 'Software Engineer' },
        { name: 'Robson', id: 4, group_id: 1, color: '#9e5fff', designation: 'Support Engineer' },
        { name: 'Laura', id: 5, group_id: 1, color: '#bbdc00', designation: 'Human Resource' },
        { name: 'Margaret', id: 6, group_id: 1, color: '#9e5fff', designation: 'Content Analyst' }
    ];
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
    return (<div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
            <div className='control-wrapper drag-sample-wrapper'>
                <div className="schedule-container">
                    <ScheduleComponent cssClass='block-events' width='100%' height='650px' startHour='08:00' endHour='20:00' 
                        selectedDate={new Date(2025, 4, 11)} 
                        currentView='TimelineDay' 
                        resourceHeaderTemplate={resourceHeaderTemplate} 
                        eventSettings={{ dataSource: data, fields: {
                            id: 'id',
                            subject: { name: 'name' },
                            startTime: { name: 'start_at' },
                            endTime: { name: 'end_at' },
                            isAllDay: { name: 'is_all_day' }
                        } }} 
                        group={{ enableCompactView: false, resources: ['Employee'] }}>
                        <ResourcesDirective>
                            <ResourceDirective field='employee_id' title='Employees' name='Employee' allowMultiple={true} dataSource={employeeData} textField='name' idField='id' colorField='Color'/>
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