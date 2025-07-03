// import api from '../../../api/api';
import api from '../../api/api';
import { 
    setSellerReportData,
    setSellerReportLoading,
    setSellerReportError,
    setSellerDateRange
} from '../Reducers/sellerReportReducer';

export const fetchSellerSalesReport = (dateRange) => async (dispatch) => {
    try {
        dispatch(setSellerReportLoading());
        
        const { data } = await api.get('/seller/sales-report', {
            params: {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString()
            },
            withCredentials: true
        });

        if (data.success) {
            dispatch(setSellerReportData({
                data: data.data,
                summary: data.summary
            }));
        } else {
            dispatch(setSellerReportError(data.error || 'Failed to fetch sales data'));
        }
    } catch (error) {
        dispatch(setSellerReportError(
            error.response?.data?.error || 
            error.message || 
            'Failed to fetch sales data'
        ));
    }
};

export const updateSellerDateRange = (dateRange) => (dispatch) => {
    dispatch(setSellerDateRange(dateRange));
};