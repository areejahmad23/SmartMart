import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesReport, setDateRange } from '../../../store/actions/salesReportActions';
import DateRangePicker from './components/DateRangePicker';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { MdCurrencyExchange } from "react-icons/md";
import { FaShoppingCart, FaChartBar } from "react-icons/fa";

const SalesReport = () => {
  const dispatch = useDispatch();
  const salesReport = useSelector(state => state.salesReport || {});
  
  const { 
    data = [], 
    summary = {}, 
    dateRange = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }, 
    loading = false 
  } = salesReport;

  useEffect(() => {
    console.log('Fetching data with date range:', dateRange);
    dispatch(fetchSalesReport(dateRange));
  }, [dateRange, dispatch]);

  useEffect(() => {
    if (data.length > 0) {
      console.log('Report Data:', {
        orderCount: data.length,
        firstOrder: data[0],
        lastOrder: data[data.length - 1]
      });
    }
  }, [data]);

  const handleDateChange = (newRange) => {
    dispatch(setDateRange(newRange));
  };

  const handleExportCSV = () => {
    if (loading || !data || data.length === 0) {
      alert(loading ? 'Data is still loading' : 'No data available to export');
      return;
    }
    exportToCSV(data);
  };

  const handleExportPDF = () => {
    if (loading || !data || data.length === 0) {
      alert(loading ? 'Data is still loading' : 'No data available to export');
      return;
    }
    exportToPDF(data, dateRange);
  };

  return (
    <div className="px-2 md:px-7 py-5 bg-[#f8f9fa]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
        <div className="flex gap-2 mt-3 md:mt-0">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white text-[#000033] border border-[#000033] rounded-lg hover:bg-[#000033] hover:text-white transition-colors"
            disabled={loading || !data || data.length === 0}
          >
            {loading ? 'Loading...' : 'Export CSV'}
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 bg-[#000033] text-white rounded-lg hover:bg-[#0055aa] transition-colors"
            disabled={loading || !data || data.length === 0}
          >
            {loading ? 'Loading...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <DateRangePicker 
        initialRange={dateRange}
        onChange={handleDateChange}
      />

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading sales data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No sales data available for selected period</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">
                  ${summary.totalRevenue?.toFixed(2) || '0.00'}
                </h2>
                <span className="text-md font-medium">Total Revenue</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl">
                <MdCurrencyExchange className="text-[#000033]" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">{summary.totalOrders || 0}</h2>
                <span className="text-md font-medium">Total Orders</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl">
                <FaShoppingCart className="text-[#000033]" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">
                  ${summary.totalRevenue && summary.totalOrders
                    ? (summary.totalRevenue / summary.totalOrders).toFixed(2) 
                    : '0.00'}
                </h2>
                <span className="text-md font-medium">Avg. Order Value</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl">
                <FaChartBar className="text-[#000033]" />
              </div>
            </div>
          </div>

          <div className="w-full bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Sales Trend</h2>
            <SalesChart data={data} />
          </div>

          <div className="w-full bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Order Details</h2>
            <SalesTable data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReport;