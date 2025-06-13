import { useActionState, useState } from "react";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import ProjectEditFormModal from "./project-edit-form";
import ProjectAddFormModal from "./project-add-form";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProjectListing({ projects, employees, setProjects }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectBudget, setProjectBudget] = useState("");
    const [projectColor, setProjectColor] = useState("");
    const [estimatedHours, setEstimatedHours] = useState("");
    const [isBillable, setIsBillable] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleEditButtonClick = (project) => {
        console.log('project data: ', project)
        setSelectedProject(project);
        setProjectName(project.name);
        setProjectBudget(project.budget);
        setProjectColor(project.color);
        setIsBillable(project.is_billable);
        setSelectedEmployees(project.selected_employees); // Update this
        setEstimatedHours(project.estimated_hours);
        setIsEditModalOpen(true);
    };

    const handleAddButtonClick = () => {
        setProjectName("");
        setProjectBudget("");
        setEstimatedHours("");
        setProjectColor("");
        setIsBillable(true);
        setSelectedEmployees([]);
        setIsAddModalOpen(true);
    };

    const handleDeleteButtonClick = (project) => {
        setSelectedProject(project);
        setIsDeleteModalOpen(true);
    };

    const handleAddFormSubmit = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: projectName,
                budget: projectBudget || null,
                estimated_hours: estimatedHours || null,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create project");
        }

        const newProject = await response.json();
        setProjects((prev) => [...prev, newProject.project]);
        setIsAddModalOpen(false);
    };

    const handleEditFormSubmit = async () => {
        const token = localStorage.getItem("token");

        console.log('isBillable: ', isBillable);
        console.log('selected employees: ', selectedEmployees);

        const response = await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: projectName,
                budget: projectBudget || null,
                estimated_hours: estimatedHours || null,
                color: projectColor,
                is_billable: isBillable,
                selected_employees: selectedEmployees
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update project");
        }

        setProjects((prev) =>
            prev.map((proj) =>
                proj.id === selectedProject.id
                    ? { ...proj, name: projectName, budget: projectBudget, estimated_hours: estimatedHours, 
                        color: projectColor, is_billable: isBillable, selected_employees: selectedEmployees }
                    : proj
            )
        );
        setIsEditModalOpen(false);
        setSelectedProject(null);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");

        await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        setProjects((prev) => prev.filter((proj) => proj.id !== selectedProject.id));
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="overflow-x-auto pt-5">
            <div className="flex justify-end mb-2">
                <button
                    onClick={handleAddButtonClick}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Add Project
                </button>
            </div>
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr className="border-b">
                        <th className="px-2 py-3 border-b">Name</th>
                        <th className="px-2 py-3 border-b">Budget (Rs)</th>
                        <th className="px-2 py-3 border-b">Estimated Hours</th>
                        <th className="px-2 py-3 border-b">Billed Hours</th>
                        <th className="px-2 py-3 border-b">Total Project Expenses</th>
                        <th className="px-2 py-3 border-b">Budget Status</th>
                        <th className="px-2 py-3 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id} className="bg-white hover:bg-gray-50">
                            <td className="px-2 py-2 border-b">{project.name}</td>
                            <td className="px-2 py-2 border-b">
                                { project.is_billable ? project.budget + ' ₹' : '-' }
                            </td>
                            <td className="px-2 py-2 border-b">{project.estimated_hours} Hrs</td>
                            <td className="px-2 py-2 border-b">
                                { project.is_billable ? project.total_billable_hours + ' Hrs' : '-' }
                            </td>
                            <td className="px-2 py-2 border-b">
                                { project.is_billable ? project.total_project_expenses + ' ₹' : '-' }
                            </td>
                            <td className="px-2 py-2 border-b text-green-700">
                                {project.is_billable ? (
                                    <>
                                        <span>{project.is_over_budget ? '- ' : '+ '}</span>
                                        {project.budget_expenses_difference}
                                    </>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-2 py-2 border-b">
                                <button
                                    onClick={() => handleEditButtonClick(project)}
                                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>{" "}
                                <button
                                    onClick={() => handleDeleteButtonClick(project)}
                                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                employeeName={selectedProject?.name}
            />

            <ProjectEditFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                employees={employees}
                projectName={projectName}
                projectBudget={projectBudget}
                estimatedHours={estimatedHours}
                projectColor={projectColor}
                isBillable={isBillable}
                selectedEmployees={selectedEmployees}
                setProjectName={setProjectName}
                setProjectBudget={setProjectBudget}
                setProjectColor={setProjectColor}
                setIsBillable={setIsBillable}
                setSelectedEmployees={setSelectedEmployees}
                setEstimatedHours={setEstimatedHours}
                handleSubmit={handleEditFormSubmit}
            />

            <ProjectAddFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                projectName={projectName}
                projectBudget={projectBudget}
                estimatedHours={estimatedHours}
                setProjectName={setProjectName}
                setProjectBudget={setProjectBudget}
                setEstimatedHours={setEstimatedHours}
                handleSubmit={handleAddFormSubmit}
            />
        </div>
    );
}
