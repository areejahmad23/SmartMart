import React from 'react';

const SalesTable = ({ data, loading, error }) => {
  if (loading) return <div className="text-center py-8 text-gray-600">Loading data...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="text-center py-8 text-gray-600">No sales data available</div>;

  // Calculate seller's earnings (after commission)
  const totalEarnings = data.reduce((sum, order) => {
    // Calculate seller's cut for each product (assuming 80% as example)
    const sellerCut = order.products.reduce((total, product) => {
      return total + (product.price * product.quantity * 0.8); // 80% of product price
    }, 0);
    return sum + sellerCut;
  }, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#000033]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Products</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Your Earnings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((order) => (
            <tr key={order._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order._id.slice(-6)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {order.products.map(p => p.name).join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.products.reduce((total, p) => total + p.quantity, 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0077cc]">
                ${order.products.reduce((total, p) => 
                  total + (p.price * p.quantity * 0.8), 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.delivery_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900">
              Total ({data.length} orders)
            </td>
            <td className="px-6 py-4 text-sm font-medium text-[#0077cc]">
              ${totalEarnings.toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesTable;