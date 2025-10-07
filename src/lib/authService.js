import apiClient from '@/lib/api';

/**
 * Auth Service - Handles all authentication related API calls
 */
const authService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User email
     * @param {string} userData.phone - User phone number
     * @param {string} userData.password - User password
     * @param {string} userData.name - User full name
     * @returns {Promise} Response with user data and message
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', {
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                name: userData.name,
            });

            // API trả về: { message: "User registered successfully", user: {...} }
            // Save user data to localStorage if needed
            if (response.user && response.user.id) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise} Response with user data and tokens
     */
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            // API trả về: { access_token, refresh_token, user: {...} }
            // Save user data and tokens to localStorage
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            if (response.access_token) {
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('access_token', response.access_token);
            }
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }

            // Dispatch custom auth state change event
            window.dispatchEvent(new CustomEvent('authStateChanged'));

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Dispatch custom auth state change event
        window.dispatchEvent(new CustomEvent('authStateChanged'));

        window.location.href = '/login';
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null} Current user object or null
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    /**
     * Get auth token from localStorage
     * @returns {string|null} Auth token or null
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean} True if user has the role
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    },

    /**
     * Check if user is customer
     * @returns {boolean} True if user is customer
     */
    isCustomer() {
        return this.hasRole('customer');
    },

    /**
     * Check if user is admin
     * @returns {boolean} True if user is admin
     */
    isAdmin() {
        return this.hasRole('admin');
    },
};

export default authService;
