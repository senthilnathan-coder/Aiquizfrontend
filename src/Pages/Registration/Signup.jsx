import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    profile: null,
    fullName: '',
    countryCode: '+91',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errorOverall, setErrorOverall] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'profile':
        if (!value) return 'Profile image is required';
        if (value.size > 5 * 1024 * 1024) return 'Image must be less than 5MB';
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)) {
          return 'Only JPG, JPEG & PNG files are allowed';
        }
        return '';
      case 'fullName': {
        const nameValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ').trim();
        setFormData((prev) => ({ ...prev, [name]: nameValue }));
        if (!nameValue) return 'Full name is required';
        if (nameValue.length < 2) return 'Must be at least 2 characters';
        if (nameValue.length > 50) return 'Too long';
        return '';
      }
      case 'countryCode': {
        const validCodes = ['+91', '+1', '+44', '+61', '+81', '+971'];
        if (!value) return 'Country code is required';
        if (!validCodes.includes(value)) return 'Invalid country code';
        return '';
      }
      case 'phoneNumber': {
        const phoneValue = value.replace(/[^0-9]/g, '');
        if (phoneValue.length <= 10) {
          setFormData((prev) => ({ ...prev, [name]: phoneValue }));
        }
        if (!phoneValue) return 'Phone number is required';
        if (!/^[6-9]\d{9}$/.test(phoneValue)) return 'Must be 10 digits and start with 6-9';
        return '';
      }
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'At least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirm your password';
        if (value !== formData.password) return 'Passwords must match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
      setProfilePreview(file ? URL.createObjectURL(file) : null);
      setErrors((prev) => ({ ...prev, profile: validateField(name, file) }));
      return;
    }

    let sanitizedValue = value;

    if (name === 'password' || name === 'confirmPassword') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9@$!%*?&]/g, '');
    }

    if (name === 'email') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9@.]/g, '').toLowerCase();
    }

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
      const formDataToSend = new FormData();
      formDataToSend.append('profile', formData.profile);
      formDataToSend.append('full_name', formData.fullName.trim());
      formDataToSend.append('country_code', formData.countryCode);
      formDataToSend.append('phone_number', formData.phoneNumber);
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirm_password', formData.confirmPassword);

      const result = await signup(formDataToSend);

      console.log(result, "dfswf");


      if (result.success) {
        if (result.user._id) {
          // localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('userId', result.user._id);
        }
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        setErrorOverall(result.error || 'Signup failed');
      }
    } catch {
      setErrorOverall('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const handleRemoveProfile = () => {
    setFormData((prev) => ({ ...prev, profile: null }));
    setProfilePreview(null);
    setErrors((prev) => ({ ...prev, profile: 'Profile image is required' }));
  };


  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 py-8 px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-blue-200/80">Join us to explore AI-powered learning</p>
          </div>

          {errorOverall && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {errorOverall}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Profile Image Section */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <label
                  htmlFor="profile"
                  className="cursor-pointer inline-block relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 hover:border-blue-500 transition-all duration-300 group"
                >
                  <input
                    type="file"
                    id="profile"
                    name="profile"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleChange}
                    className="hidden"
                  />
                  {profilePreview ? (
                    <>
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:opacity-75 transition-all duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <FaImage className="text-3xl text-white/80" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                      <FaImage className="text-4xl text-blue-200/60" />
                    </div>
                  )}
                </label>

                {profilePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveProfile}
                    className="absolute -top-2 -right-2 bg-red-500/90 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    aria-label="Remove photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {errors.profile && (
                <p className="text-red-400 text-sm">{errors.profile}</p>
              )}

              <p className="text-blue-200/60 text-xs">
                Supported formats: JPG, JPEG, PNG (max 5MB)
              </p>
            </div>

            {/* Full Name - fixed alignment */}
            <div className="relative flex items-center">
              <FaUser className="absolute left-3 text-blue-200/60 text-lg" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
              {errors.fullName && <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{errors.fullName}</p>}
            </div>

            {/* Phone - fixed alignment */}
            <div className="flex space-x-4">
              <div className="w-1/3 relative flex items-center">
                <FaPhone className="absolute left-3 text-blue-200/60 text-lg rotate-90" />
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500/50"
                >
                  <option className='text-blue-500' value="+91">🇮🇳 +91</option>
                  <option className='text-blue-500' value="+1">🇺🇸 +1</option>
                  <option className='text-blue-500' value="+44">🇬🇧 +44</option>
                  <option className='text-blue-500' value="+61">🇦🇺 +61</option>
                  <option className='text-blue-500' value="+81">🇯🇵 +81</option>
                  <option className='text-blue-500' value="+971">🇦🇪 +971</option>
                </select>
              </div>
              <div className="w-2/3 relative flex items-center">
                <input
                  type="tel"
                  maxLength={10}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                />
                {errors.phoneNumber && <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Email - fixed alignment */}
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
              {errors.email && <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* Password - fixed alignment */}
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
              {errors.password && <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password - fixed alignment */}
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-blue-200/60 text-lg" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-blue-200/70 hover:text-blue-200 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
              {errors.confirmPassword && (
                <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit button - improved styling */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-300 mt-8 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="text-center text-blue-200/80 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

// Add handleRemoveProfile inside the component
const handleRemoveProfile = () => {
  setFormData(prev => ({ ...prev, profile: null }));
  setProfilePreview(null);
  setErrors(prev => ({ ...prev, profile: 'Profile image is required' }));

  // Reset the file input
  const fileInput = document.getElementById('profile');
  if (fileInput) {
    fileInput.value = '';
  }
};

export default Signup;
