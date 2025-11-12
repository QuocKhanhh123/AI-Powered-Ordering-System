// Base API configuration
const API_BASE_URL = 'http://localhost:3000';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh
 */
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers when token is refreshed
 */
const onTokenRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

/**
 * API Client for making HTTP requests
 */
const apiClient = {
    /**
     * Make a request to the API
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: defaultHeaders,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized - Token expired
                if (response.status === 401 && endpoint !== '/api/auth/refresh_token') {
                    // Try to refresh token
                    try {
                        if (isRefreshing) {
                            // If already refreshing, wait for it
                            return new Promise((resolve, reject) => {
                                subscribeTokenRefresh((newToken) => {
                                    // Retry original request with new token
                                    options.headers = {
                                        ...options.headers,
                                        'Authorization': `Bearer ${newToken}`,
                                    };
                                    resolve(this.request(endpoint, options));
                                });
                            });
                        }

                        isRefreshing = true;

                        const refreshToken = localStorage.getItem('refresh_token');
                        if (!refreshToken) {
                            throw new Error('No refresh token');
                        }

                        // Refresh the token
                        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh_token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ refresh_token: refreshToken }),
                        });

                        const refreshData = await refreshResponse.json();

                        if (!refreshResponse.ok) {
                            throw new Error('Token refresh failed');
                        }

                        // Update tokens
                        if (refreshData.access_token) {
                            localStorage.setItem('token', refreshData.access_token);
                            localStorage.setItem('access_token', refreshData.access_token);
                        }
                        if (refreshData.refresh_token) {
                            localStorage.setItem('refresh_token', refreshData.refresh_token);
                        }

                        isRefreshing = false;
                        onTokenRefreshed(refreshData.access_token);

                        // Retry original request with new token
                        return this.request(endpoint, options);
                    } catch (refreshError) {
                        isRefreshing = false;
                        // Refresh failed, logout user
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.dispatchEvent(new CustomEvent('authStateChanged'));

                        // Redirect to login
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }

                        throw {
                            status: 401,
                            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                            data: null,
                        };
                    }
                }

                throw {
                    status: response.status,
                    message: data.message || 'Something went wrong',
                    data: data,
                };
            }

            return data;
        } catch (error) {
            // If it's already our formatted error, throw it
            if (error.status) {
                throw error;
            }
            // Network or parsing error
            throw {
                status: 0,
                message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
                data: null,
            };
        }
    },

    /**
     * Make a GET request
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'GET',
        });
    },

    /**
     * Make a POST request
     */
    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Make a PUT request
     */
    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Make a DELETE request
     */
    delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE',
        });
    },

    /**
     * Make a PATCH request
     */
    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

export default apiClient;
export { API_BASE_URL };
