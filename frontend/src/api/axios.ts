import axios from 'axios';

console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem('TOKEN') ||
        (() => {
            const rawUser = localStorage.getItem('USER') || localStorage.getItem('user');
            if (!rawUser) return null;

            try {
                const user = JSON.parse(rawUser) as { token?: string };
                return user.token || null;
            } catch {
                return null;
            }
        })();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
