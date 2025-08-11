import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Settings() {
    const [holidays, setHolidays] = useState(["Saturday", "Sunday"]);
    const [workingHoursStart, setWorkingHoursStart] = useState("09:00");
    const [workingHoursEnd, setWorkingHoursEnd] = useState("18:00");
    const [currency, setCurrency] = useState("INR");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const showMessage = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    // Load settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${API_BASE_URL}/api/settings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setHolidays(data.holidays || ["Saturday", "Sunday"]);
                    setWorkingHoursStart(data.working_hours_start || "09:00");
                    setWorkingHoursEnd(data.working_hours_end || "18:00");
                    setCurrency(data.currency || "INR");
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            holidays,
            working_hours_start: workingHoursStart,
            working_hours_end: workingHoursEnd,
            currency
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings`, {
                method: "POST", // or PUT if your API expects update
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save settings");
            }

            showMessage("✅ Settings saved successfully");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="p-4">Loading settings...</div>;
    }

    return (
        <div className="mx-auto p-5 bg-white shadow rounded">
            {successMessage && (
                <div className="mb-4 p-2 text-sm text-green-800 bg-green-100 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            <h1>Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                {/* Holidays */}
                <div>
                    <label className="block text-sm font-medium mb-1">Holidays</label>
                    <div className="flex flex-wrap gap-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={holidays.includes(day)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setHolidays((prev) => [...prev, day]);
                                        } else {
                                            setHolidays((prev) => prev.filter((d) => d !== day));
                                        }
                                    }}
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Working Hours */}
                <div>
                    <label className="block text-sm font-medium mb-1">Working Hours</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="time"
                            value={workingHoursStart}
                            onChange={(e) => setWorkingHoursStart(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                        <span>to</span>
                        <input
                            type="time"
                            value={workingHoursEnd}
                            onChange={(e) => setWorkingHoursEnd(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                </div>

                {/* Currency */}
                <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
