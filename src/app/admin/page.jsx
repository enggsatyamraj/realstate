"use client";

import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [inquiries, setInquiries] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Check if user is already authenticated on page load
    useEffect(() => {
        const checkAuth = () => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (isAdmin === 'true') {
                setIsAuthenticated(true);
                fetchInquiries();
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        // Validate credentials
        if (loginData.email === 'vishal@dwi.com' && loginData.password === 'vishal7651@dwi') {
            localStorage.setItem('isAdmin', 'true');
            setIsAuthenticated(true);
            fetchInquiries();
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        setInquiries([]);
    };

    const fetchInquiries = async () => {
        try {
            setIsLoadingData(true);
            const response = await fetch('/api/inquiries');
            if (!response.ok) {
                throw new Error('Failed to fetch inquiries');
            }
            const data = await response.json();
            setInquiries(data.inquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>

                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline text-black"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">Back to Homepage</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                            <a
                                href="/"
                                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Back to Website
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">User Inquiries</h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all form submissions</p>
                        </div>
                        <button
                            onClick={fetchInquiries}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            disabled={isLoadingData}
                        >
                            {isLoadingData ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>

                    {isLoadingData ? (
                        <div className="text-center py-10">
                            <div className="text-lg text-gray-700">Loading data...</div>
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="text-lg text-gray-700">No inquiries found</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inquiries.map((inquiry) => (
                                        <tr key={inquiry._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {inquiry.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {inquiry.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {inquiry.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(inquiry.submitted_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}