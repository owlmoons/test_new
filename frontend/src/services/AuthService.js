import api from "./BaseService"; 

export const handleGoogleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
};

export const signupUser = async (credential, userName) => {
    const response = await api.post('/auth/signup', { credential, userName });
    return response.data;
};

export const getGoogleUserInfo = async () => {
    try {
        const response = await api.get('/auth/google-info');
        return response.data;
    } catch (error) {
        console.error("Error fetching Google user info:", error);
        throw error;
    }
};

export const checkEmailExists = async (email) => {
    const response = await api.get(`/auth/check-email/${email}`);
    return response.data;
};

export const checkUserNameExists = async (userName) => {
    const response = await api.get(`/auth/check-username/${userName}`);
    return response.data; 
};

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data; 
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};
