import { RiShoppingCart2Fill } from "react-icons/ri";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_dashboard_index_data } from '../../store/reducers/dashboardReducer';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { recentOrders, totalOrder, pendingOrder, cancelledOrder } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(get_dashboard_index_data(userInfo.id));
    }, [dispatch, userInfo.id]);

    const redirect = (order) => {
        const items = order.products.reduce((total, product) => total + product.quantity, 0);
        navigate('/payment', {
            state: {
                price: order.price,
                items,
                orderId: order._id 
            }
        });
    };

    const statusBadge = (status) => {
        const statusClasses = {
            'paid': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'processing': 'bg-blue-100 text-blue-800',
            'completed': 'bg-purple-100 text-purple-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-4">
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <StatCard 
                    icon={<RiShoppingCart2Fill />}
                    value={totalOrder}
                    label="Total Orders"
                    color="green"
                />
                <StatCard 
                    icon={<RiShoppingCart2Fill />}
                    value={pendingOrder}
                    label="Pending Orders"
                    color="blue"
                />
                <StatCard 
                    icon={<RiShoppingCart2Fill />}
                    value={cancelledOrder}
                    label="Cancelled Orders"
                    color="red"
                />
            </div>

            {/* Recent Orders Table */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-xl font-bold text-[#000033] mb-4'>Recent Orders</h2>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Order ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Price</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Payment Status</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Order Status</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {recentOrders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>#{order._id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>${order.price.toFixed(2)}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {statusBadge(order.payment_status)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {statusBadge(order.delivery_status)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2'>
                                        <Link 
                                            to={`/dashboard/order/details/${order._id}`}
                                            className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors'
                                        >
                                            View
                                        </Link>
                                        {order.payment_status !== 'paid' && (
                                            <button
                                                onClick={() => redirect(order)}
                                                className='px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors'
                                            >
                                                Pay Now
                                            </button>
                                        )}
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

const StatCard = ({ icon, value, label, color = 'green' }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        purple: 'bg-purple-100 text-purple-800'
    };

    return (
        <div className='bg-white rounded-lg shadow-sm p-4 flex items-center gap-4'>
            <div className={`${colorClasses[color]} w-12 h-12 rounded-full flex items-center justify-center text-xl`}>
                {icon}
            </div>
            <div>
                <h3 className='text-2xl font-bold text-[#000033]'>{value}</h3>
                <p className='text-sm text-gray-500'>{label}</p>
            </div>
        </div>
    );
};

export default Index;