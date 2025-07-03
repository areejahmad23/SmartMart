import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Admin Dashboard Thunks
export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async(_, {rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/admin/get-dashboard-data', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) { 
            return rejectWithValue(error.response.data);
        }
    }
);

// Seller Dashboard Thunks
export const get_seller_dashboard_data = createAsyncThunk(
    'dashboard/get_seller_dashboard_data',
    async(_, {rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/seller/get-dashboard-data', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) { 
            return rejectWithValue(error.response.data);
        }
    }
);

// Time-based Statistics Thunks (Admin)
export const get_daily_stats = createAsyncThunk(
    'dashboard/get_daily_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/daily-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_weekly_stats = createAsyncThunk(
    'dashboard/get_weekly_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/get-weekly-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_monthly_stats = createAsyncThunk(
    'dashboard/get_monthly_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/monthly-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Seller-specific Time-based Statistics Thunks
export const get_seller_daily_stats = createAsyncThunk(
    'dashboard/get_seller_daily_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/seller-daily-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_weekly_stats = createAsyncThunk(
    'dashboard/get_seller_weekly_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/seller-weekly-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_monthly_stats = createAsyncThunk(
    'dashboard/get_seller_monthly_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/seller-monthly-stats', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    // Dashboard Summary Data
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalPendingOrder: 0,
    totalSeller: 0,
    recentOrder: [],
    recentMessage: [],
    
    // Admin Time-based Stats
    weeklyStats: null,
    loadingWeeklyStats: false,
    errorWeeklyStats: null,
    
    monthlyStats: null,
    loadingMonthlyStats: false,
    errorMonthlyStats: null,
    
    dailyStats: null,
    loadingDailyStats: false,
    errorDailyStats: null,
    
    // Seller Time-based Stats
    sellerWeeklyStats: null,
    loadingSellerWeeklyStats: false,
    errorSellerWeeklyStats: null,
    
    sellerMonthlyStats: null,
    loadingSellerMonthlyStats: false,
    errorSellerMonthlyStats: null,
    
    sellerDailyStats: null,
    loadingSellerDailyStats: false,
    errorSellerDailyStats: null,
    
    // Common Loading States
    loading: false,
    error: null
};

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.error = null;
        },
        clearStatsErrors: (state) => {
            state.errorWeeklyStats = null;
            state.errorMonthlyStats = null;
            state.errorDailyStats = null;
            state.errorSellerWeeklyStats = null;
            state.errorSellerMonthlyStats = null;
            state.errorSellerDailyStats = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Admin Dashboard Data
            .addCase(get_admin_dashboard_data.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.totalSale = payload.totalSale;
                state.totalOrder = payload.totalOrder;
                state.totalProduct = payload.totalProduct;
                state.totalSeller = payload.totalSeller;
                state.recentOrder = payload.recentOrders || [];
                state.recentMessage = payload.messages || [];
            })
            .addCase(get_admin_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload?.message || 'Failed to load admin dashboard data';
            })
            
            // Seller Dashboard Data
            .addCase(get_seller_dashboard_data.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.totalSale = payload.totalSale;
                state.totalOrder = payload.totalOrder;
                state.totalProduct = payload.totalProduct;
                state.totalPendingOrder = payload.totalPendingOrder;
                state.recentOrder = payload.recentOrders || [];
                state.recentMessage = payload.messages || [];
            })
            .addCase(get_seller_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload?.message || 'Failed to load seller dashboard data';
            })
            
            // Admin Time-based Stats
            .addCase(get_daily_stats.pending, (state) => {
                state.loadingDailyStats = true;
                state.errorDailyStats = null;
            })
            .addCase(get_daily_stats.fulfilled, (state, { payload }) => {
                state.loadingDailyStats = false;
                state.dailyStats = payload;
            })
            .addCase(get_daily_stats.rejected, (state, { payload }) => {
                state.loadingDailyStats = false;
                state.errorDailyStats = payload?.message || 'Failed to load daily stats';
            })
            
            .addCase(get_weekly_stats.pending, (state) => {
                state.loadingWeeklyStats = true;
                state.errorWeeklyStats = null;
            })
            .addCase(get_weekly_stats.fulfilled, (state, { payload }) => {
                state.loadingWeeklyStats = false;
                state.weeklyStats = payload;
            })
            .addCase(get_weekly_stats.rejected, (state, { payload }) => {
                state.loadingWeeklyStats = false;
                state.errorWeeklyStats = payload?.message || 'Failed to load weekly stats';
            })
            
            .addCase(get_monthly_stats.pending, (state) => {
                state.loadingMonthlyStats = true;
                state.errorMonthlyStats = null;
            })
            .addCase(get_monthly_stats.fulfilled, (state, { payload }) => {
                state.loadingMonthlyStats = false;
                state.monthlyStats = payload;
            })
            .addCase(get_monthly_stats.rejected, (state, { payload }) => {
                state.loadingMonthlyStats = false;
                state.errorMonthlyStats = payload?.message || 'Failed to load monthly stats';
            })
            
            // Seller Time-based Stats
            .addCase(get_seller_daily_stats.pending, (state) => {
                state.loadingSellerDailyStats = true;
                state.errorSellerDailyStats = null;
            })
            .addCase(get_seller_daily_stats.fulfilled, (state, { payload }) => {
                state.loadingSellerDailyStats = false;
                state.sellerDailyStats = payload;
            })
            .addCase(get_seller_daily_stats.rejected, (state, { payload }) => {
                state.loadingSellerDailyStats = false;
                state.errorSellerDailyStats = payload?.message || 'Failed to load seller daily stats';
            })
            
            .addCase(get_seller_weekly_stats.pending, (state) => {
                state.loadingSellerWeeklyStats = true;
                state.errorSellerWeeklyStats = null;
            })
            .addCase(get_seller_weekly_stats.fulfilled, (state, { payload }) => {
                state.loadingSellerWeeklyStats = false;
                state.sellerWeeklyStats = payload;
            })
            .addCase(get_seller_weekly_stats.rejected, (state, { payload }) => {
                state.loadingSellerWeeklyStats = false;
                state.errorSellerWeeklyStats = payload?.message || 'Failed to load seller weekly stats';
            })
            
            .addCase(get_seller_monthly_stats.pending, (state) => {
                state.loadingSellerMonthlyStats = true;
                state.errorSellerMonthlyStats = null;
            })
            .addCase(get_seller_monthly_stats.fulfilled, (state, { payload }) => {
                state.loadingSellerMonthlyStats = false;
                state.sellerMonthlyStats = payload;
            })
            .addCase(get_seller_monthly_stats.rejected, (state, { payload }) => {
                state.loadingSellerMonthlyStats = false;
                state.errorSellerMonthlyStats = payload?.message || 'Failed to load seller monthly stats';
            });
    }
});

export const { messageClear, clearStatsErrors } = dashboardReducer.actions;
export default dashboardReducer.reducer;