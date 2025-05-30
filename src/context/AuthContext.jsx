// import React, { createContext, useContext, useState, useEffect } from 'react';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const storedAuth = localStorage.getItem('auth');
//         if (storedAuth) {
//             const parsedAuth = JSON.parse(storedAuth);
//             setUser(parsedAuth.user);
//             setToken(parsedAuth.token);
//         }
//     }, []);

//     const login = async (email, password) => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append('email', email);
//             formData.append('password', password);

//             const response = await fetch('http://localhost:8000/user/signin/', {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();
//             console.log(data, "login response");

//             if (!response.ok) throw new Error(data.error || 'Login failed');

//             const userData = {
//                 _id: data.user_id,
//                 email,
//             };

//             const userId = data.user_id;

//             const authData = {
//                 user: userData,
//                 token: data.token,
//             };

//             setUser(userData);
//             setToken(data.token);
//             localStorage.setItem('auth', JSON.stringify(authData));
//             localStorage.setItem('userId', userId);

//             return { success: true };
//         } catch (error) {
//             console.error('Login error:', error.message);
//             return { success: false, error: error.message };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const signup = async (formData) => {
//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:8000/user/signup/', {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();
//             console.log(data, "signup response");

//             if (!response.ok) throw new Error(data.error || 'Signup failed');

//             const userData = {
//                 _id: data.user_id,
//                 email: formData.get("email"),
//                 fullName: formData.get("full_name"),
//             };

//             const authData = {
//                 user: userData,
//                 token: data.token,
//             };

//             setUser(userData);
//             setToken(data.token);
//             localStorage.setItem('auth', JSON.stringify(authData));

//             return { success: true };
//         } catch (error) {
//             console.error('Signup error:', error.message);
//             return { success: false, error: error.message };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchUserProfile = async () => {
//         if (!user?._id) return null;
//         try {
//             const response = await fetch(`http://localhost:8000/userdashboard/${user._id}/`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) throw new Error('Failed to fetch profile');

//             const data = await response.json();
//             const updatedUser = { ...user, ...data.user };
//             setUser(updatedUser);
//             localStorage.setItem('auth', JSON.stringify({ user: updatedUser, token }));
//             return updatedUser;
//         } catch (error) {
//             console.error('Profile fetch error:', error.message);
//             return null;
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('auth');
//         setUser(null);
//         setToken(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 token,
//                 loading,
//                 login,
//                 signup,
//                 logout,
//                 fetchUserProfile,
//                 isAuthenticated: !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };



import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // New state for AuthContext's own loading

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                setUser(parsedAuth.user);
                setToken(parsedAuth.token);
            } catch (e) {
                console.error("Failed to parse stored auth data:", e);
                // Clear invalid data if parsing fails
                localStorage.removeItem('auth');
            }
        }
        setAuthLoading(false); // AuthContext has finished checking localStorage
    }, []);

    // ... (login, signup, fetchUserProfile, logout functions remain the same) ...

    const login = async (email, password) => {
        setAuthLoading(true); // Indicate loading during login
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/user/signin/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data, "login response");

            if (!response.ok) throw new Error(data.error || 'Login failed');

            // Ensure full_name is present after login, if your backend sends it
            // Or fetch profile immediately after login to get it
            const userData = {
                _id: data.user_id,
                email,
                // Add full_name here if your signin response provides it, otherwise fetch it.
                // For example: full_name: data.full_name || null,
            };

            const authData = {
                user: userData,
                token: data.token,
            };

            setUser(userData);
            setToken(data.token);
            localStorage.setItem('auth', JSON.stringify(authData));
            // localStorage.setItem('userId', userId); // You store userId within 'auth' now, so this might be redundant.

            return { success: true };
        } catch (error) {
            console.error('Login error:', error.message);
            return { success: false, error: error.message };
        } finally {
            setAuthLoading(false); // End loading
        }
    };

    const signup = async (formData) => {
        setAuthLoading(true); // Indicate loading during signup
        try {
            const response = await fetch('http://localhost:8000/user/signup/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data, "signup response");

            if (!response.ok) throw new Error(data.error || 'Signup failed');

            const userData = {
                _id: data.user_id,
                email: formData.get("email"),
                full_name: formData.get("full_name"), // Use full_name for consistency
            };

            const authData = {
                user: userData,
                token: data.token,
            };

            setUser(userData);
            setToken(data.token);
            localStorage.setItem('auth', JSON.stringify(authData));

            return { success: true };
        } catch (error) {
            console.error('Signup error:', error.message);
            return { success: false, error: error.message };
        } finally {
            setAuthLoading(false); // End loading
        }
    };

    const fetchUserProfile = async () => {
        // ... (your existing fetchUserProfile logic) ...
        // Ensure this updates the user object in context with full_name if available.
    };

    const logout = () => {
        localStorage.removeItem('auth');
        setUser(null);
        setToken(null);
        setAuthLoading(false); // Not loading after logout
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading: authLoading, // Use authLoading for the context's loading status
                login,
                signup,
                logout,
                fetchUserProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};