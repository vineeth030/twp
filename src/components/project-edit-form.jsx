import React from "react";

export default function ProjectEditFormModal({
    isOpen,
    onClose,
    projectName,
    projectBudget,
    estimatedHours,
    projectColor,
    isBillable,
    selectedEmployees,
    setProjectName,
    setProjectBudget,
    setEstimatedHours,
    setProjectColor,
    setIsBillable,
    handleSubmit,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
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
                        <label className="block text-sm font-medium mb-1">Budget (optional)</label>
                        <input
                            type="number"
                            placeholder="Budget (optional)"
                            value={projectBudget}
                            onChange={(e) => setProjectBudget(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estimated Hours (optional)</label>
                        <input
                            type="number"
                            placeholder="Estimated Hours (optional)"
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Choose Color</label>
                        <input
                            type="color"
                            value={projectColor}
                            onChange={(e) => setProjectColor(e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isBillable}
                            onChange={(e) => setIsBillable(e.target.checked)}
                            id="billable"
                            className="w-4 h-4"
                        />
                        <label htmlFor="billable" className="text-sm font-medium">Billable</label>
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
