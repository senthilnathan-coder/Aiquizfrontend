import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  FaUserCircle,
  FaGlobe,
  FaCheck,
  FaSignOutAlt,
  FaTachometerAlt,
  FaSignInAlt,
} from 'react-icons/fa';
import company from '../assets/Logo.png'; // replace with your logo path
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState({
    value: 'US',
    label: '🇺🇸 English (US)',
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const countryOptions = [
    { value: 'US', label: '🇺🇸 English (US)', region: 'North America' },
    { value: 'GB', label: '🇬🇧 English (UK)', region: 'Europe' },
    { value: 'IN', label: '🇮🇳 हिंदी', region: 'Asia' },
    // ...add more countries as you want
  ];

  const groupedOptions = countryOptions.reduce((acc, option) => {
    const group = acc.find((g) => g.label === option.region);
    if (group) {
      group.options.push(option);
    } else {
      acc.push({ label: option.region, options: [option] });
    }
    return acc;
  }, []);

  const customStyles = {
    control: (base) => ({
      ...base,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      minHeight: 'unset',
      width: '40px',
    }),
    dropdownIndicator: () => ({ display: 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (base) => ({
      ...base,
      background: '#1a1f2e',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      padding: '0.5rem',
      width: '250px',
    }),
    group: (base) => ({
      ...base,
      padding: '0.5rem 0',
      '&:not(:last-child)': {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      },
    }),
    groupHeading: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      borderRadius: '0.5rem',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
      },
      '&:active': {
        background: 'rgba(255, 255, 255, 0.2)',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.8)',
    }),
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-lg bg-white/10 rounded">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={company} alt="Logo" className="w-32 h-auto" />
        </div>

        <div className="flex items-center gap-4 justify-center px-4">
          {/* Language Selector */}
          <div className="relative bottom-3">
            <Select
              className="text-white/80"
              options={groupedOptions}
              styles={customStyles}
              isSearchable={false}
              value={selectedCountry}
              onChange={(option) => setSelectedCountry(option)}
              components={{
                SingleValue: () => (
                  <FaGlobe
                    size={22}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  />
                ),
                Option: ({ data, isSelected, ...props }) => (
                  <div {...props} className="flex items-center justify-between">
                    <span>{data.label}</span>
                    {isSelected && <FaCheck className="text-green-400" size={12} />}
                  </div>
                ),
              }}
            />
          </div>

          {/* Profile or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                {user.profile ? (
                  <img
                    src={
                      typeof user.profile === 'string' && user.profile.trim() !== ''
                        ? user.profile
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.full_name
                          )}&background=random&size=200`
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl text-white/80" />
                )}
                <span className="text-white/80">{user.full_name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg py-1 border border-white/10 z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/userdashboard');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:bg-white/10 w-full text-left"
                  >
                    <FaTachometerAlt />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:bg-white/10 w-full text-left"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <FaSignInAlt />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
