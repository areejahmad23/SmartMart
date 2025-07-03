import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    summary: {},
    dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        endDate: new Date()
    },
    loading: false,
    error: null
};

export const sellerReportSlice = createSlice({
    name: 'sellerReport',
    initialState,
    reducers: {
        setSellerReportData: (state, action) => {
            state.data = action.payload.data || [];
            state.summary = action.payload.summary || {};
            state.loading = false;
        },
        setSellerReportLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setSellerReportError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setSellerDateRange: (state, action) => {
            state.dateRange = action.payload;
        },
        clearSellerReport: (state) => {
            state.data = [];
            state.summary = {};
            state.error = null;
        }
    }
});

export const { 
    setSellerReportData,
    setSellerReportLoading,
    setSellerReportError,
    setSellerDateRange,
    clearSellerReport
} = sellerReportSlice.actions;

export default sellerReportSlice.reducer;