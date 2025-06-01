const Order = require('../../models/order'); // Adjust model name/path if needed

exports.generateSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'Date range required' });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // include whole day

    const orders = await Order.find({ createdAt: { $gte: from, $lte: to } });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    const productCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.productName;
        productCount[name] = (productCount[name] || 0) + item.quantity;
      });
    });

    const bestSeller = Object.keys(productCount).reduce((a, b) =>
      productCount[a] > productCount[b] ? a : b,
      'No Sales'
    );

    res.json({
      totalSales,
      totalOrders,
      bestSeller,
      dateRange: `${fromDate} to ${toDate}`,
    });
  } catch (err) {
    console.error('Sales report error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
