import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  get_admin_dashboard_data,
  get_weekly_stats,
  get_monthly_stats,
  get_daily_stats
} from '../../store/Reducers/dashboardReducer';
import { useSelector } from 'react-redux';
import moment from 'moment';
import seller from '../../assets/seller.png';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState('daily'); // 'daily', 'weekly' or 'monthly'
  
  const { 
    totalSale, 
    totalOrder, 
    totalProduct, 
    totalSeller, 
    recentOrder, 
    recentMessage,
    weeklyStats,
    monthlyStats,
    dailyStats
  } = useSelector(state => state.dashboard);
  
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(get_admin_dashboard_data());
    if (timeRange === 'daily') {
      dispatch(get_daily_stats());
    } else if (timeRange === 'weekly') {
      dispatch(get_weekly_stats());
    } else {
      dispatch(get_monthly_stats());
    }
  }, [dispatch, timeRange]);

  // Format data for chart based on time range
  const formatChartData = () => {
    if (timeRange === 'daily') {
      if (!dailyStats) {
        return {
          series: [
            { name: "Orders", data: [0] },
            { name: "Revenue", data: [0] },
            { name: "Sellers", data: [0] }
          ],
          categories: ['Today']
        };
      }

      return {
        series: [
          { name: "Orders", data: [dailyStats.orders] },
          { name: "Revenue", data: [dailyStats.revenue] },
          { name: "Sellers", data: [dailyStats.sellers] }
        ],
        categories: ['Today']
      };
    } else if (timeRange === 'weekly') {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      if (!weeklyStats) {
        return {
          series: [
            { name: "Orders", data: Array(7).fill(0) },
            { name: "Revenue", data: Array(7).fill(0) },
            { name: "Sellers", data: Array(7).fill(0) }
          ],
          categories: daysOfWeek
        };
      }

      const orderedStats = daysOfWeek.map(day => {
        const dayData = weeklyStats.find(item => item.day === day) || {
          orders: 0,
          revenue: 0,
          sellers: 0
        };
        return dayData;
      });

      return {
        series: [
          { name: "Orders", data: orderedStats.map(day => day.orders) },
          { name: "Revenue", data: orderedStats.map(day => day.revenue) },
          { name: "Sellers", data: orderedStats.map(day => day.sellers) }
        ],
        categories: daysOfWeek
      };
    } else {
      // Monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (!monthlyStats) {
        return {
          series: [
            { name: "Orders", data: Array(12).fill(0) },
            { name: "Revenue", data: Array(12).fill(0) },
            { name: "Sellers", data: Array(12).fill(0) }
          ],
          categories: months
        };
      }

      const orderedStats = months.map(month => {
        const monthData = monthlyStats.find(item => item.month === month) || {
          orders: 0,
          revenue: 0,
          sellers: 0
        };
        return monthData;
      });

      return {
        series: [
          { name: "Orders", data: orderedStats.map(month => month.orders) },
          { name: "Revenue", data: orderedStats.map(month => month.revenue) },
          { name: "Sellers", data: orderedStats.map(month => month.sellers) }
        ],
        categories: months
      };
    }
  };

  const chartData = formatChartData();

  const state = {
    series: chartData.series,
    options: {
      colors: ["#000033", "#0077cc", "#000000"],
      chart: {
        background: 'transparent',
        foreColor: '#000000',
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: timeRange === 'daily' ? '30%' : '70%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: chartData.categories,
        labels: {
          style: {
            colors: '#000000',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000',
          },
        },
      },
      legend: {
        position: 'top',
        markers: {
          radius: 12,
        },
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 5,
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function(value, { seriesIndex }) {
            // Only add $ for revenue (seriesIndex 1)
            return seriesIndex === 1 ? `$${value}` : value;
          },
        },
      },
    },
  };

  return (
    <div className='px-2 md:px-7 py-5 bg-[#f8f9fa]'>
      {/* Cards Section */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
        {/* Total Sales Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col justify-start items-start text-[#ffffff]'>
            <h2 className='text-3xl font-bold'>${totalSale}</h2>
            <span className='text-md font-medium'>Total Sales</span>
          </div>
          <div className='w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl'>
            <MdCurrencyExchange className='text-[#000033] shadow-lg' />
          </div>
        </div>

        {/* Products Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col justify-start items-start text-[#ffffff]'>
            <h2 className='text-3xl font-bold'>{totalProduct}</h2>
            <span className='text-md font-medium'>Products</span>
          </div>
          <div className='w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl'>
            <MdProductionQuantityLimits className='text-[#000033] shadow-lg' />
          </div>
        </div>

        {/* Sellers Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col justify-start items-start text-[#ffffff]'>
            <h2 className='text-3xl font-bold'>{totalSeller}</h2>
            <span className='text-md font-medium'>Sellers</span>
          </div>
          <div className='w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl'>
            <FaUsers className='text-[#000033] shadow-lg' />
          </div>
        </div>

        {/* Orders Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col justify-start items-start text-[#ffffff]'>
            <h2 className='text-3xl font-bold'>{totalOrder}</h2>
            <span className='text-md font-medium'>Orders</span>
          </div>
          <div className='w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl'>
            <FaCartShopping className='text-[#000033] shadow-lg' />
          </div>
        </div>
      </div>


      {/* Chart Section */}
      <div className='w-full flex flex-wrap mt-7'>
        <div className='w-full lg:w-7/12 lg:pr-3'>
          <div className='w-full bg-[#ffffff] p-4 rounded-md shadow-[0_-4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_-4px_15px_rgba(0,0,0,0.2)] transition-all duration-300'>
            {/* Time Range Selector */}
            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setTimeRange('daily')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    timeRange === 'daily'
                      ? 'bg-[#000033] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange('weekly')}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === 'weekly'
                      ? 'bg-[#000033] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    timeRange === 'monthly'
                      ? 'bg-[#000033] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <Chart options={state.options} series={state.series} type='bar' height={350} />
          </div>
        </div>

        {/* Recent Seller Messages */}
        <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
          <div className='w-full bg-[#ffffff] p-4 rounded-md shadow-[0_-4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_-4px_15px_rgba(0,0,0,0.2)] transition-all duration-300'>
            <div className='flex justify-between items-center'>
              <h2 className='font-semibold text-lg text-[#000000] pb-3'>Recent Seller Messages</h2>
              <Link className='font-semibold text-sm text-[#0077cc] hover:text-[#000033] transition-colors'>View All</Link>
            </div>
            <div className='flex flex-col gap-2 pt-6'>
              <ol className='relative border-l border-[#0077cc] ml-4'>
                {
                   recentMessage.map((m, i) =>
                  <li key={i} className='mb-3 ml-6'>
                    <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#0077cc] rounded-full z-10'>
                    {
                     m.senderId === userInfo._id ? <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> : <img className='w-full rounded-full h-full shadow-lg' src={seller} alt="" />
                    }
                    </div>
                    <div className='p-3 bg-[#ffffff] rounded-lg border border-[#0077cc] shadow-sm hover:shadow-md transition-all duration-300'>
                      <div className='flex justify-between items-center mb-2'>
                        <Link className='text-md font-normal text-[#000000]'>{m.senderName}</Link>
                        <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0 text-[#000000]'>{moment(m.createdAt).startOf('hour').fromNow()}</time>
                      </div>
                      <div className='p-2 text-xs font-normal bg-[#ffffff] rounded-lg border border-[#0077cc] text-[#000000]'>
                      {m.message}
                      </div>
                    </div>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className='w-full p-4 bg-[#ffffff] rounded-md mt-6 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_-4px_15px_rgba(0,0,0,0.2)] transition-all duration-300'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-lg text-[#000000] pb-3'>Recent Orders</h2>
          <Link className='font-semibold text-sm text-[#0077cc] hover:text-[#000033] transition-colors'>View All</Link>
        </div>
        <div className='relative overflow-x-auto'>
          <table className='w-full text-sm text-left text-[#000000]'>
            <thead className='text-sm text-[#000000] uppercase border-b border-[#0077cc]'>
              <tr>
                <th scope='col' className='py-3 px-4'>Order Id</th>
                <th scope='col' className='py-3 px-4'>Price</th>
                <th scope='col' className='py-3 px-4'>Payment Status</th>
                <th scope='col' className='py-3 px-4'>Order Status</th>
                <th scope='col' className='py-3 px-4'>Active</th>
              </tr>
            </thead>
            <tbody>
              {recentOrder.map((d, i) => (
                <tr key={i} className='hover:bg-[#f8f9fa] transition-all duration-200'>
                  <td className='py-3 px-4 font-medium whitespace-nowrap'>#{d._id}</td>
                  <td className='py-3 px-4 font-medium whitespace-nowrap'>${d.price}</td>
                  <td className='py-3 px-4 font-medium whitespace-nowrap'>{d.payment_status}</td>
                  <td className='py-3 px-4 font-medium whitespace-nowrap'>{d.delivery_status}</td>
                  <td className='py-3 px-4 font-medium whitespace-nowrap'>
                    <Link to={`/admin/dashboard/order/details/${d._id}`} className='text-[#0077cc] hover:text-[#000033] transition-colors'>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;