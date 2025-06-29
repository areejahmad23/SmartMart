import {
  FETCH_SALES_REPORT_REQUEST,
  FETCH_SALES_REPORT_SUCCESS,
  FETCH_SALES_REPORT_FAIL,
  SET_DATE_RANGE
} from '../constants/salesReportConstants';

const initialState = {
  data: [],
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
    avgOrderValue: 0
  },
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default 30 days
    endDate: new Date()
  },
  loading: false,
  error: null,
  lastUpdated: null
};

const salesReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALES_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_SALES_REPORT_SUCCESS:
      const { data = [], summary = {} } = action.payload;
      return {
        ...state,
        loading: false,
        data,
        summary: {
          totalRevenue: summary.totalRevenue || 0,
          totalOrders: summary.totalOrders || 0,
          totalItems: summary.totalItems || 0,
          avgOrderValue: summary.totalOrders > 0 
            ? parseFloat((summary.totalRevenue / summary.totalOrders).toFixed(2))
            : 0
        },
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case FETCH_SALES_REPORT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: [],
        summary: initialState.summary
      };

    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: {
          startDate: action.payload.startDate || state.dateRange.startDate,
          endDate: action.payload.endDate || state.dateRange.endDate
        }
      };

    default:
      return state;
  }
};

export default salesReportReducer;