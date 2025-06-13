import React from "react";
import Select from "react-select";
import ReactSwitch from "react-switch";

export default function ProjectEditFormModal({
    isOpen,
    onClose,
    projectName,
    projectBudget,
    estimatedHours,
    projectColor,
    isBillable,
    employees,
    selectedEmployees,
    setSelectedEmployees,
    setProjectName,
    setProjectBudget,
    setEstimatedHours,
    setProjectColor,
    setIsBillable,
    handleSubmit,
}) {
    if (!isOpen) return null;

    const employeeOptions = employees.map(emp => ({
        value: emp.id,
        label: emp.name
      }));
      
    const selectedOptions = employeeOptions.filter(option =>
        selectedEmployees.includes(option.value)
    );
    
    const handleSwitchChange = nextChecked => {
        setIsBillable(nextChecked);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-1">Edit Project</h2>
                <hr className="border-t border-gray-300 mb-5" />
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Project Name</label>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Budget</label>
                        <input
                            type="number"
                            placeholder="Budget"
                            value={projectBudget}
                            onChange={(e) => setProjectBudget(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estimated Hours</label>
                        <input
                            type="number"
                            placeholder="Estimated Hours"
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex space-x-4 items-center">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Choose Color</label>
                            <input
                                type="color"
                                value={projectColor}
                                onChange={(e) => setProjectColor(e.target.value)}
                                className="w-16 h-10 p-1 border rounded"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-6">
                            <ReactSwitch
                                onChange={handleSwitchChange}
                                checked={isBillable}
                                className="react-switch"
                            />
                            <span className="text-sm font-medium">Billable</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Assign Employees</label>
                        <Select
                            isMulti
                            options={employeeOptions}
                            value={selectedOptions}
                            onChange={(selected) =>
                                setSelectedEmployees(selected.map(option => option.value))
                            }
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                </div>
            </div>
        </div>
    );
}
