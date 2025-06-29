import React from 'react';

const SalesTable = ({ data }) => {
  // Calculate totals
  const orderCount = data.length;
  const revenueTotal = data.reduce((sum, order) => sum + order.orderTotal, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#000033]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Products
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((order) => (
            <tr key={order._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order._id.toString().slice(-6)} {/* Show shortened ID */}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {order.products.map(p => p.name).join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0077cc]">
                ${order.orderTotal.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900">
              Total ({orderCount} orders)
            </td>
            <td className="px-6 py-4 text-sm font-medium text-[#0077cc]">
              ${revenueTotal.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesTable;