import React, { useState, useEffect } from "react";

export default function TeamMemberEditForm({
    isOpen,
    onClose,
    handleSubmit,
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
}) {
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        // Reset errors when modal opens
        if (isOpen) {
            setErrors({
                name: '',
                email: '',
                password: ''
            });
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            password: ''
        };
        let isValid = true;

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
            isValid = false;
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                newErrors.email = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // Password validation (only if provided)
        if (password && password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = () => {
        if (validateForm()) {
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Manager</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-left">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                                setErrors(prev => ({ ...prev, name: '' }));
                            }
                        }}
                        className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-left">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors(prev => ({ ...prev, email: '' }));
                            }
                        }}
                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-left">New Password (optional)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                                setErrors(prev => ({ ...prev, password: '' }));
                            }
                        }}
                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter new password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleFormSubmit}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
