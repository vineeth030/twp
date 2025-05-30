import React from "react";

export default function ProjectEditFormModal({
    isOpen,
    onClose,
    projectName,
    projectBudget,
    estimatedHours,
    setProjectName,
    setProjectBudget,
    setEstimatedHours,
    handleSubmit,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Budget (optional)"
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Estimated Hours (optional)"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                </div>
            </div>
        </div>
    );
}
