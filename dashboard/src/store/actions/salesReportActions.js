import axios from '../../api/api';
import {
  FETCH_SALES_REPORT_REQUEST,
  FETCH_SALES_REPORT_SUCCESS,
  FETCH_SALES_REPORT_FAIL,
  SET_DATE_RANGE
} from '../constants/salesReportConstants';

const formatAPIDate = (date) => {
  return date.toISOString();
};

export const fetchSalesReport = (dateRange) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SALES_REPORT_REQUEST });

    const params = {
      startDate: formatAPIDate(dateRange.startDate),
      endDate: formatAPIDate(dateRange.endDate)
    };

    console.log('Fetching sales report with params:', params);

    const { data } = await axios.get('/admin/sales-report', { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch sales report');
    }

    dispatch({
      type: FETCH_SALES_REPORT_SUCCESS,
      payload: {
        data: data.data,
        summary: data.summary
      }
    });

  } catch (error) {
    console.error('Sales report fetch error:', error);
    dispatch({
      type: FETCH_SALES_REPORT_FAIL,
      payload: error.response?.data?.error || error.message
    });
  }
};

export const setDateRange = (dateRange) => (dispatch) => {
  dispatch({
    type: SET_DATE_RANGE,
    payload: dateRange
  });
};

export const refreshSalesReport = () => (dispatch, getState) => {
  const { dateRange } = getState().salesReport;
  return dispatch(fetchSalesReport(dateRange));
};