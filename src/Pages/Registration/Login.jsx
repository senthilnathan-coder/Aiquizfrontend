import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGoogleLogin } from '@react-oauth/google';
import logo from '../../assets/Logo.png'

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth(); // Assume loginWithGoogle is implemented in your AuthContext

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorOverall, setErrorOverall] = useState('');

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                return '';
            case 'password': {
                // Sanitize password: only allowed chars
                const passwordValue = value.replace(/[^a-zA-Z0-9@$!%*?&]/g, '');

                if (!passwordValue) return 'Password is required';
                if (passwordValue.length < 8) return 'Password must be at least 8 characters';

                // You can add more rules here, like uppercase, digit, etc.
                return '';
            }
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Sanitize password input before setting form data
        const sanitizedValue = name === 'password' ? value.replace(/[^a-zA-Z0-9@$!%*?&]/g, '') : value;

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
    };


    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorOverall('');

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const result = await login(formData.email.trim(), formData.password);
            console.log(result, "login result");

            if (result.success) {
                if (result.user_id) {
                    localStorage.setItem('userId', result.user_id);
                }
                toast.success('Logged in successfully!');
                console.log(result, "login result1");

                navigate('/ai-questions');
            } else {
                setErrorOverall(result.error || 'Login failed');
            }
        } catch {
            setErrorOverall('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Google OAuth login handler
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsSubmitting(true);
                // Pass Google access token to your backend
                const result = await loginWithGoogle(tokenResponse.access_token);

                if (result.success) {
                    toast.success('Logged in with Google!');
                    navigate('/dashboard');
                } else {
                    setErrorOverall(result.error || 'Google login failed');
                }
            } catch {
                setErrorOverall('Google login error');
            } finally {
                setIsSubmitting(false);
            }
        },
        onError: () => {
            setErrorOverall('Google login failed');
        }
    });

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 py-8 px-4">
                <div className="max-w-md w-full bg-gray-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-600">

                    <div className=" flex flex-col items-center justify-center text-center mb-8">

                        <h2 className="text-3xl font-bold text-white mb-5">Welcome Back</h2>
                        {/* <p className="mt-2 text-blue-200/80">Login to your account</p> */}
                        <img src={logo} alt="logo" className='w-60  drop-shadow-lg cursor-pointer' onClick={() => navigate('/')} />
                    </div>

                    {errorOverall && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            {errorOverall}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Email */}
                        <div className="relative flex items-center">
                            <FaEnvelope className="absolute left-3 text-blue-200/60 text-lg" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                            />
                            {errors.email && <p className="absolute -bottom-6 right-0 text-red-400 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-3 text-blue-200/60 text-lg" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-blue-200/70 hover:text-blue-200 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                            </button>
                            {errors.password && <p className="absolute -bottom-6 right-0 text-red-400 text-sm">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-300 mt-4 font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="my-6 text-center text-blue-200/80">or</div>

                    {/* Google OAuth button */}
                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 py-3 rounded-xl text-white transition-all duration-300 disabled:opacity-50"
                    >
                        <FaGoogle className="text-lg" />
                        <span>Continue with Google</span>
                    </button>

                    <p className="text-center text-blue-200/80 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
