import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const showMessage = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    // Load profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${API_BASE_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompanyName(data.company_name || "");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const token = localStorage.getItem("token");
        const payload = {
            ...(password ? { password, password_confirmation: confirmPassword } : {})
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: "POST", // Or PUT depending on your API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            showMessage("✅ Profile updated successfully");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="p-4">Loading profile...</div>;
    }

    return (
        <div className="mx-auto p-5 bg-white">
            {successMessage && (
                <div className="mb-4 p-2 text-sm text-green-800 bg-green-100 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            <h1>Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6 mt-10 shadow rounded p-5">
                
                {/* <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        required
                    />
                </div> */}

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
