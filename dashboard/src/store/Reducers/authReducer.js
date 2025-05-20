import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

// Admin Login
export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/admin-login', info, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Seller Login
export const seller_login = createAsyncThunk(
    'auth/seller_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-login', info, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get User Info
export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-user', { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Profile Image Upload
export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-image-upload', image, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Seller Register
export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-register', info, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Profile Info Add
export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-info-add', info, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/logout', { withCredentials: true });
            localStorage.removeItem('accessToken');
            if (role === 'admin') {
                navigate('/admin/login');
            } else {
                navigate('/login');
            }
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Change Password
export const change_password = createAsyncThunk(
    'auth/change_password',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/change_password', info, { withCredentials: true });
            return fulfillWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Helper to return role
const returnRole = (token) => {
    if (token) {
        const decodeToken = jwtDecode(token);
        const expireTime = new Date(decodeToken.exp * 1000);
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken');
            return '';
        } else {
            return decodeToken.role;
        }
    } else {
        return '';
    }
};

// Slice
export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken')
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Admin Login
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Seller Login
            .addCase(seller_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Seller Register
            .addCase(seller_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Get User Info
            .addCase(get_user_info.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
            })
            .addCase(get_user_info.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // Profile Image Upload
            .addCase(profile_image_upload.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message;
            })

            // Profile Info Add
            .addCase(profile_info_add.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_info_add.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message;
            })

            // Change Password
            .addCase(change_password.pending, (state) => {
                state.loader = true;
                state.errorMessage = null;
            })
            .addCase(change_password.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload;
            })
            .addCase(change_password.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload;
            });
    }
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
