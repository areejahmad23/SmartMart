import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits, MdTrendingUp } from "react-icons/md";
import { FaUsers, FaRegChartBar } from "react-icons/fa";
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
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartKey, setChartKey] = useState(Date.now()); // Key to force re-render
  
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
    if (timeRange === 'weekly') {
      dispatch(get_weekly_stats());
    } else if (timeRange === 'monthly') {
      dispatch(get_monthly_stats());
    }
    dispatch(get_daily_stats());
  }, [dispatch, timeRange]);

  // Force chart re-render when data updates
  useEffect(() => {
    if (dailyStats) {
      setChartKey(Date.now());
    }
  }, [dailyStats]);

  const formatComparisonChartData = () => {
    if (timeRange === 'weekly') {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      if (!weeklyStats) {
        return {
          series: [
            { name: "Orders", data: Array(7).fill(0) },
            { name: "Revenue", data: Array(7).fill(0) }
          ],
          categories: daysOfWeek
        };
      }

      const orderedStats = daysOfWeek.map(day => {
        const dayData = weeklyStats.find(item => item.day === day) || {
          orders: 0,
          revenue: 0
        };
        return dayData;
      });

      return {
        series: [
          { name: "Orders", data: orderedStats.map(day => day.orders) },
          { name: "Revenue", data: orderedStats.map(day => day.revenue) }
        ],
        categories: daysOfWeek
      };
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (!monthlyStats) {
        return {
          series: [
            { name: "Orders", data: Array(12).fill(0) },
            { name: "Revenue", data: Array(12).fill(0) }
          ],
          categories: months
        };
      }

      const orderedStats = months.map(month => {
        const monthData = monthlyStats.find(item => item.month === month) || {
          orders: 0,
          revenue: 0
        };
        return monthData;
      });

      return {
        series: [
          { name: "Orders", data: orderedStats.map(month => month.orders) },
          { name: "Revenue", data: orderedStats.map(month => month.revenue) }
        ],
        categories: months
      };
    }
  };

  const getDailyMetrics = () => {
    if (!dailyStats) {
      return {
        revenue: 0,
        orders: 0,
        newSellers: 0,
        visitors: 1
      };
    }

    return {
      revenue: dailyStats.revenue || 0,
      orders: dailyStats.orders || 0,
      newSellers: dailyStats.sellers || 0,
      visitors: dailyStats.visitors || 1
    };
  };

  const dailyMetrics = getDailyMetrics();
  const comparisonChartData = formatComparisonChartData();

  const barChartOptions = {
    colors: ["#000033", "#0077cc"],
    chart: {
      background: 'transparent',
      foreColor: '#000000',
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
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
      categories: comparisonChartData.categories,
      labels: {
        style: {
          colors: '#000000',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Orders",
          style: {
            color: '#000033',
          }
        },
        labels: {
          style: {
            colors: '#000033',
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Revenue ($)",
          style: {
            color: '#0077cc',
          }
        },
        labels: {
          style: {
            colors: '#0077cc',
          },
          formatter: (value) => `$${value}`
        },
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(value, { seriesIndex }) {
          return seriesIndex === 1 ? `$${value}` : value;
        },
      },
    },
    legend: {
      position: 'top',
    }
  };

  const radialChartOptions = {
    chart: {
      type: 'radialBar',
      height: 300,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          position: 'front',
        },
        track: {
          background: '#f0f0f0',
          strokeWidth: '67%',
          margin: 0,
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold'
          },
          value: {
            color: '#000033',
            fontSize: '36px',
            fontWeight: 'bold',
            show: true,
            formatter: function(val) {
              return `$${val}`;
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#0077cc'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Today\'s Revenue'],
  };

  const TrendCard = ({ title, value, change, icon }) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {icon}
          </div>
        </div>
        <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <MdTrendingUp className="mr-1" />
          ) : (
            <MdTrendingUp className="mr-1 transform rotate-180" />
          )}
          <span>{Math.abs(change)}% from yesterday</span>
        </div>
      </div>
    );
  };

  return (
    <div className='px-2 md:px-7 py-5 bg-[#f8f9fa]'>
      {/* Cards Section */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7'>
        {/* Total Sales Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all'>
          <div className='flex flex-col justify-start items-start text-white'>
            <h2 className='text-3xl font-bold'>${totalSale}</h2>
            <span className='text-md font-medium'>Total Sales</span>
          </div>
          <div className='w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl'>
            <MdCurrencyExchange className='text-[#000033]' />
          </div>
        </div>

        {/* Products Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all'>
          <div className='flex flex-col justify-start items-start text-white'>
            <h2 className='text-3xl font-bold'>{totalProduct}</h2>
            <span className='text-md font-medium'>Products</span>
          </div>
          <div className='w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl'>
            <MdProductionQuantityLimits className='text-[#000033]' />
          </div>
        </div>

        {/* Sellers Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all'>
          <div className='flex flex-col justify-start items-start text-white'>
            <h2 className='text-3xl font-bold'>{totalSeller}</h2>
            <span className='text-md font-medium'>Sellers</span>
          </div>
          <div className='w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl'>
            <FaUsers className='text-[#000033]' />
          </div>
        </div>

        {/* Orders Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-lg gap-3 shadow-lg hover:shadow-xl transition-all'>
          <div className='flex flex-col justify-start items-start text-white'>
            <h2 className='text-3xl font-bold'>{totalOrder}</h2>
            <span className='text-md font-medium'>Orders</span>
          </div>
          <div className='w-12 h-12 rounded-full bg-white flex justify-center items-center text-xl'>
            <FaCartShopping className='text-[#000033]' />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='w-full flex flex-col lg:flex-row gap-5'>
        {/* Comparison Chart */}
        <div className='w-full lg:w-8/12 bg-white p-5 rounded-lg shadow-sm border border-gray-100'>
          <div className="flex justify-between items-center mb-5">
            <h2 className='text-xl font-bold text-gray-800'>
              {timeRange === 'weekly' ? 'Weekly' : 'Monthly'} Comparison
            </h2>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
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
          
          <Chart 
            options={barChartOptions} 
            series={comparisonChartData.series} 
            type='bar' 
            height={350} 
          />
        </div>

        {/* Daily Metrics Section */}
        <div className='w-full lg:w-4/12 flex flex-col gap-5'>
          {/* Radial Chart - Fixed with key and loading */}
          <div className='bg-white p-5 rounded-lg shadow-sm border border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800 mb-5'>Today's Revenue</h2>
            {dailyStats ? (
              <Chart
                key={chartKey}
                options={radialChartOptions}
                series={[dailyMetrics.revenue]}
                type="radialBar"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading revenue data...</div>
              </div>
            )}
          </div>

          {/* Trend Cards */}
          <div className='grid grid-cols-2 gap-4'>
            <TrendCard
              title="Today's Orders"
              value={dailyStats ? dailyMetrics.orders : '--'}
              change={dailyStats ? 10 : 0}
              icon={<FaCartShopping className="text-blue-600" />}
            />
            <TrendCard
              title="New Sellers"
              value={dailyStats ? dailyMetrics.newSellers : '--'}
              change={dailyStats ? 5 : 0}
              icon={<FaUsers className="text-green-600" />}
            />
            <TrendCard
              title="Conversion Rate"
              value={dailyStats ? `${((dailyMetrics.orders / dailyMetrics.visitors) * 100).toFixed(1)}%` : '--%'}
              change={dailyStats ? 2.5 : 0}
              icon={<FaRegChartBar className="text-purple-600" />}
            />
            <TrendCard
              title="Avg. Order Value"
              value={dailyStats ? `$${(dailyMetrics.revenue / (dailyMetrics.orders || 1)).toFixed(2)}` : '--'}
              change={dailyStats ? 7.8 : 0}
              icon={<MdCurrencyExchange className="text-orange-600" />}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='w-full flex flex-col lg:flex-row gap-5 mt-5'>
        {/* Recent Messages */}
        <div className='w-full lg:w-6/12 bg-white p-5 rounded-lg shadow-sm border border-gray-100'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-bold text-gray-800'>Recent Messages</h2>
            <Link to="/admin/messages" className='text-sm font-medium text-blue-600 hover:text-blue-800'>
              View All
            </Link>
          </div>
          <div className='space-y-4'>
            {recentMessage.slice(0, 4).map((message, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <img 
                    src={message.senderId === userInfo._id ? userInfo.image : seller} 
                    alt="Sender" 
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {message.senderName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {moment(message.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className='w-full lg:w-6/12 bg-white p-5 rounded-lg shadow-sm border border-gray-100'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-bold text-gray-800'>Recent Orders</h2>
            <Link to="/admin/orders" className='text-sm font-medium text-blue-600 hover:text-blue-800'>
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrder.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      ${order.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.delivery_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.delivery_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/admin/dashboard/order/details/${order._id}`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;