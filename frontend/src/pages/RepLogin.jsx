import React, { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';

const RepLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/users/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.is_representative) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('taluka', data.taluka);
                    localStorage.setItem('is_representative', 'true');
                    localStorage.setItem('is_representative', 'true');
                    navigate('/dashboard');
                } else {
                    setError('Access Denied. Not a Government Representative.');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary mb-2">PublicLink</h1>
                    <h2 className="text-xl text-gray-600 font-medium">Government Portal</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Official ID / Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Enter your official ID"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Secure Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Access Dashboard
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    New Representative?{' '}
                    <Link to="/rep-signup" className="text-primary hover:text-blue-700 font-medium transition-colors">
                        Register here
                    </Link>
                </div>
                <div className="mt-4 text-center text-xs text-gray-400 border-t pt-4">
                    Authorized Personnel Only. Unauthorized access is prohibited.
                </div>
            </div>
        </div>
    );
};

export default RepLogin;
