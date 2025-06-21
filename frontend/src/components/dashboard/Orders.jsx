import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';

const Orders = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { myOrders } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(get_orders({ status: statusFilter, customerId: userInfo.id }));
    }, [statusFilter]);

    const redirectToPayment = (order) => {
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
            'warehouse': 'bg-blue-100 text-blue-800',
            'delivered': 'bg-purple-100 text-purple-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-4">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <h2 className='text-xl font-bold text-[#000033]'>My Orders</h2>
                <select 
                    className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent'
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Orders</option>
                    <option value="placed">Placed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="warehouse">Warehouse</option>
                </select>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
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
                            {myOrders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>#{order._id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>${order.price}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {statusBadge(order.payment_status)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {statusBadge(order.delivery_status)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2'>
                                        <Link
                                            to={`/dashboard/order/details/${order._id}`}
                                            className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm'
                                        >
                                            View
                                        </Link>
                                        {order.payment_status !== 'paid' && (
                                            <button
                                                onClick={() => redirectToPayment(order)}
                                                className='px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm'
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

export default Orders;