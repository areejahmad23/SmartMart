import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerSalesReport, updateSellerDateRange } from '../../../store/actions/sellerReportActions';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import DateRangePicker from './components/DateRangePicker';
import { exportToCSV, exportToPDF } from './utils/ExportUtils';
import { MdCurrencyExchange } from "react-icons/md";
import { FaShoppingCart, FaChartBar } from "react-icons/fa";

const SalesReport = () => {
  const dispatch = useDispatch();
  const { 
    data = [], 
    summary = {}, 
    dateRange = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }, 
    loading = false,
    error = null
  } = useSelector(state => state.sellerReport);

  useEffect(() => {
    dispatch(fetchSellerSalesReport(dateRange));
  }, [dateRange, dispatch]);

  const handleDateChange = (newRange) => {
    dispatch(updateSellerDateRange(newRange));
  };

  const handleExportCSV = () => {
    if (loading || !data || data.length === 0) {
      alert(loading ? 'Data is still loading' : 'No data available to export');
      return;
    }
    exportToCSV(data, 'seller_sales_report');
  };

  const handleExportPDF = () => {
    if (loading || !data || data.length === 0) {
      alert(loading ? 'Data is still loading' : 'No data available to export');
      return;
    }
    exportToPDF(data, dateRange, 'seller_sales_report');
  };

  // Calculate seller-specific metrics
  const sellerMetrics = data.reduce((acc, order) => {
    const orderTotal = order.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity * 0.8); // 80% seller commission
    }, 0);
    return {
      totalEarnings: acc.totalEarnings + orderTotal,
      totalOrders: acc.totalOrders + 1,
      avgOrderValue: ((acc.totalEarnings + orderTotal) / (acc.totalOrders + 1))
    };
  }, { totalEarnings: 0, totalOrders: 0, avgOrderValue: 0 });

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
      ) : error ? (
        <div className="text-center py-8 text-red-600">Error: {error.message || 'Failed to load data'}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No sales data available for selected period</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">
                  ${sellerMetrics.totalEarnings.toFixed(2)}
                </h2>
                <span className="text-md font-medium">Your Earnings</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl">
                <MdCurrencyExchange className="text-[#000033]" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">{sellerMetrics.totalOrders}</h2>
                <span className="text-md font-medium">Total Orders</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl">
                <FaShoppingCart className="text-[#000033]" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col justify-start items-start text-white">
                <h2 className="text-3xl font-bold">
                  ${sellerMetrics.avgOrderValue.toFixed(2)}
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
            <SalesChart 
              data={data} 
              dateRange={dateRange} 
              commissionRate={0.8} // 80% seller commission
            />
          </div>

          <div className="w-full bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Order Details</h2>
            <SalesTable 
              data={data} 
              loading={loading} 
              error={error}
              commissionRate={0.8} // 80% seller commission
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReport;