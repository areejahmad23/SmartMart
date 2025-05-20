import React from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
import { useEffect } from 'react';
import customer from '../../assets/demo.jpg'

const SellerDashboard = () => {
  const dispatch = useDispatch()
  const {totalSale,totalOrder,totalProduct,totalPendingOrder,recentOrder,recentMessage} = useSelector(state=> state.dashboard)
  const {userInfo} = useSelector(state=> state.auth)



  useEffect(() => {
      dispatch(get_seller_dashboard_data())
  }, [])

  const state = {
    series: [
      {
        name: "Orders",
        data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45]
      },
      {
        name: "Revenue",
        data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78]
      },
      {
        name: "Sellers",
        data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56]
      },
    ],
    options: {
      colors: ["#000033", "#0077cc", "#000000"], // Consistent color scheme
      chart: {
        background: 'transparent',
        foreColor: '#000000', // Dark text for readability
        toolbar: {
          show: true, // Enable toolbar for zoom and download
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%', // Increased bar width
          endingShape: 'rounded', // Rounded bar edges
        },
      },
      dataLabels: {
        enabled: false, // Disable data labels for cleaner look
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'], // Remove stroke for a cleaner look
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#000000', // Dark text for readability
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000', // Dark text for readability
          },
        },
      },
      legend: {
        position: 'top', // Move legend to the top
        markers: {
          radius: 12, // Rounded legend markers
        },
      },
      grid: {
        borderColor: '#f0f0f0', // Light grid lines
        strokeDashArray: 5, // Dashed grid lines
      },
      tooltip: {
        theme: 'light', // Light tooltip theme
        y: {
          formatter: (value) => `$${value}`, // Add dollar sign for revenue
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
            <h2 className='text-3xl font-bold'>{totalOrder}</h2>
            <span className='text-md font-medium'>Orders</span>
          </div>
          <div className='w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl'>
            <FaUsers className='text-[#000033] shadow-lg' />
          </div>
        </div>

        {/* Orders Card */}
        <div className='flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col justify-start items-start text-[#ffffff]'>
            <h2 className='text-3xl font-bold'>{totalPendingOrder}</h2>
            <span className='text-md font-medium'>Pending Orders</span>
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
                      m.senderId === userInfo._id ? <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> : <img className='w-full rounded-full h-full shadow-lg' src={customer} alt="" />
                    }                 
                    </div>
                    <div className='p-3 bg-[#ffffff] rounded-lg border border-[#0077cc] shadow-sm hover:shadow-md transition-all duration-300'>
                      <div className='flex justify-between items-center mb-2'>
                        <Link className='text-md font-normal text-[#000000]'>{m.senderName}</Link>
                        <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0 text-[#000000]'>{moment(m.createdAt).startOf('hour').fromNow()}</time>
                      </div>
                      <div className='p-2 text-xs font-normal bg-[#ffffff] rounded-lg border border-[#0077cc]
                       text-[#000000]'>
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
                    <Link to={`/seller/dashboard/order/details/${d._id}`} className='text-[#0077cc] hover:text-[#000033] transition-colors'>View</Link>
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

export default SellerDashboard;