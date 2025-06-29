import axios from '../api/api';
import {
  FETCH_SALES_REPORT_REQUEST,
  FETCH_SALES_REPORT_SUCCESS,
  FETCH_SALES_REPORT_FAIL
} from '../constants/salesReportConstants';

/**
 * Format date to YYYY-MM-DD format for API consistency
 * @param {Date} date 
 * @returns {string} Formatted date string
 */
const formatAPIDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Fetch sales report data from API
 * @param {Object} dateRange - Contains startDate and endDate
 * @returns {Function} Redux thunk function
 */
export const fetchSalesReport = (dateRange) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SALES_REPORT_REQUEST });

    // Log the request being made
    console.log('Fetching sales report with date range:', {
      start: dateRange.startDate,
      end: dateRange.endDate
    });

    // Make API request
    const { data } = await axios.get('/admin/sales-report', {
      params: {
        startDate: formatAPIDate(dateRange.startDate),
        endDate: formatAPIDate(dateRange.endDate)
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    // Validate response structure
    if (!data || !data.success) {
      throw new Error(data?.error || 'Invalid response structure');
    }

    // Log successful response
    console.log('Sales report data received:', {
      dataPoints: data.data.length,
      summary: data.summary
    });

    dispatch({
      type: FETCH_SALES_REPORT_SUCCESS,
      payload: data
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Sales report API error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });

    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.data?.error || 
                     `Server responded with ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response received from server';
    }

    dispatch({
      type: FETCH_SALES_REPORT_FAIL,
      payload: errorMessage
    });
  }
};

/**
 * Helper function to refetch sales report with current date range
 * @returns {Function} Redux thunk function
 */
export const refreshSalesReport = () => (dispatch, getState) => {
  const { dateRange } = getState().salesReport;
  return dispatch(fetchSalesReport(dateRange));
};