// Similar to employee-listing.jsx
import { useState } from "react";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import TeamMemberEditFormModal from "./team-member-edit-form";
import TeamMemberAddFormModal from "./team-member-add-form";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TeamMemberListing({ members, setMembers }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const showMessage = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000); // hides after 3s
    };

    const handleAdd = () => setIsAddModalOpen(true);
    const handleEdit = (member) => {
        setSelectedMember(member);
        setName(member.name);
        setEmail(member.email);
        setIsEditModalOpen(true);
    };
    const handleDelete = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };

    const token = localStorage.getItem("token");

    const addMember = async () => {
        if (!name || !email || !password) return;

        const res = await fetch(`${API_BASE_URL}/api/team-members`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        setMembers(prev => [...prev, data.user]);
        setName("");
        setEmail("");
        setIsAddModalOpen(false);
        showMessage("Manager added successfully");
    };

    const updateMember = async () => {
        const res = await fetch(`${API_BASE_URL}/api/team-members/${selectedMember.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name, email })
        });

        if (res.ok) {
            setMembers(prev =>
                prev.map(m =>
                    m.id === selectedMember.id ? { ...m, name, email } : m
                )
            );
            setSelectedMember(null);
            setIsEditModalOpen(false);
            showMessage("Manager updated successfully");
        }
    };

    const confirmDelete = async () => {
        await fetch(`${API_BASE_URL}/api/team-members/${selectedMember.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
        setIsDeleteModalOpen(false);
        setSelectedMember(null);
        showMessage("Manager deleted successfully");
    };

    return (
        <div className="overflow-x-auto pt-5">

            {successMessage && (
                <div className="mb-4 p-2 text-sm text-green-800 bg-green-100 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            <h1>Managers</h1>
            <div className="flex justify-end mb-2">
                <button onClick={handleAdd} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Add Manager</button>
            </div>
            <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr className="border-b">
                        <th className="px-2 py-3 border-b">Name</th>
                        <th className="px-2 py-3 border-b">Email</th>
                        <th className="px-2 py-3 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.id} className="bg-white hover:bg-gray-50">
                            <td className="px-2 py-2 border-b">{member.name}</td>
                            <td className="px-2 py-2 border-b">{member.email}</td>
                            <td className="px-2 py-1 border-b">
                                <button onClick={() => handleEdit(member)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(member)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ml-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                employeeName={selectedMember?.name}
            />

            <TeamMemberEditFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                name={name}
                email={email}
                setName={setName}
                setEmail={setEmail}
                handleSubmit={updateMember}
            />

            <TeamMemberAddFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                name={name}
                email={email}
                password={password}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                handleSubmit={addMember}
            />
        </div>
    );
}
