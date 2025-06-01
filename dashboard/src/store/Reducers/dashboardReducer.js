import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Existing thunks remain the same
export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/admin/get-dashboard-data',{withCredentials: true})             
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_seller_dashboard_data = createAsyncThunk(
   'dashboard/get_seller_dashboard_data',
   async( _ ,{rejectWithValue, fulfillWithValue}) => { 
       try {
           const {data} = await api.get('/seller/get-dashboard-data',{withCredentials: true})             
           return fulfillWithValue(data)
       } catch (error) { 
           return rejectWithValue(error.response.data)
       }
   }
)

// Add this with your other thunks
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

// NEW: Add weekly stats thunk
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

// Add this to your existing actions-> Monthly
export const get_monthly_stats = createAsyncThunk(
    'dashboard/get_monthly_stats',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/monthly-stats', {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState:{
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrder: [],
        recentMessage: [],
        weeklyStats: null, // NEW: Add weeklyStats to initial state
        loadingWeeklyStats: false, // NEW: Add loading state
        errorWeeklyStats: null,
        monthlyStats: null,
loadingMonthlyStats: false,
errorMonthlyStats: null, // NEW: Add error state
   dailyStats: null,
    loadingDailyStats: false,
    errorDailyStats: null
    },
    reducers: {
        messageClear: (state,_) => {
            state.errorMessage = ""
        },
        // NEW: Add a reducer to clear weekly stats errors if needed
        clearWeeklyStatsError: (state) => {
            state.errorWeeklyStats = null;
        }
    },
    extraReducers: (builder) => {
       builder 
       .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
           state.totalSale = payload.totalSale
           state.totalOrder = payload.totalOrder
           state.totalProduct = payload.totalProduct 
           state.totalSeller = payload.totalSeller
           state.recentOrder = payload.recentOrders
           state.recentMessage = payload.messages
       })
       .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
           state.totalSale = payload.totalSale
           state.totalOrder = payload.totalOrder
           state.totalProduct = payload.totalProduct 
           state.totalPendingOrder = payload.totalPendingOrder
           state.recentOrder = payload.recentOrders
           state.recentMessage = payload.messages
       })
       // NEW: Add cases for weekly stats
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
    }
});

export const { messageClear, clearWeeklyStatsError } = dashboardReducer.actions;
export default dashboardReducer.reducer;