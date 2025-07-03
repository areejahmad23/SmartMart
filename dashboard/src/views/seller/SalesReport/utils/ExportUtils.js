import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// CSV Export for Seller (with commission calculation)
export const exportToCSV = (data) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No sales data available to export');
    }

    // Prepare CSV headers (matches seller table columns)
    const headers = ['Date', 'Order ID', 'Products', 'Quantity', 'Your Earnings', 'Status'];
    
    // Process each order into CSV rows with 80% commission
    const rows = data.map(order => {
      const sellerEarnings = order.products.reduce((total, product) => {
        return total + (product.price * product.quantity * 0.8);
      }, 0);
      
      const products = order.products.map(p => p.name).join(', ');
      
      return [
        new Date(order.createdAt).toLocaleDateString(),  // Formatted date
        order._id.toString().slice(-6),                 // Last 6 chars of Order ID
        products.includes(',') ? `"${products}"` : products,  // Quote-wrapped if contains commas
        order.products.reduce((sum, p) => sum + p.quantity, 0), // Total quantity
        `$${sellerEarnings.toFixed(2)}`,                // Seller's earnings after commission
        order.delivery_status                           // Order status
      ];
    });

    // Calculate and add totals row
    const orderCount = data.length;
    const totalEarnings = data.reduce((sum, order) => {
      return sum + order.products.reduce((total, product) => {
        return total + (product.price * product.quantity * 0.8);
      }, 0);
    }, 0);
    const totalQuantity = data.reduce((total, order) => 
      total + order.products.reduce((sum, p) => sum + p.quantity, 0), 0);

    rows.push([
      '',  // Empty date
      '',  // Empty order ID
      `Total (${orderCount} orders)`,
      totalQuantity,
      `$${totalEarnings.toFixed(2)}`,
      ''  // Empty status
    ]);

    // Generate CSV content
    const csvContent = [
      headers.join(','),  // Header row
      ...rows.map(row => row.join(','))  // Data rows
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `seller_sales_${new Date().toISOString().slice(0, 10)}.csv`;
    saveAs(blob, fileName);

  } catch (error) {
    console.error('CSV Export Error:', error);
    alert(`Failed to generate CSV: ${error.message}`);
  }
};

// PDF Export for Seller (with commission calculation)
export const exportToPDF = (data, dateRange) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No sales data available to export');
    }

    // Initialize PDF
    const doc = new jsPDF();
    const orderCount = data.length;
    const totalEarnings = data.reduce((sum, order) => {
      return sum + order.products.reduce((total, product) => {
        return total + (product.price * product.quantity * 0.8);
      }, 0);
    }, 0);
    const totalQuantity = data.reduce((total, order) => 
      total + order.products.reduce((sum, p) => sum + p.quantity, 0), 0);

    // Title and date range
    doc.setFontSize(18);
    doc.text('Seller Sales Report', 14, 20);
    doc.setFontSize(12);
    doc.text(
      `From ${dateRange.startDate.toDateString()} to ${dateRange.endDate.toDateString()}`,
      14, 30
    );
    doc.text(`Total Earnings: $${totalEarnings.toFixed(2)}`, 14, 40);

    // Prepare table data with 80% commission
    const tableData = data.map(order => {
      const sellerEarnings = order.products.reduce((total, product) => {
        return total + (product.price * product.quantity * 0.8);
      }, 0);
      
      return [
        new Date(order.createdAt).toLocaleDateString(),
        order._id.toString().slice(-6),
        order.products.map(p => p.name).join(', '),
        order.products.reduce((sum, p) => sum + p.quantity, 0),
        `$${sellerEarnings.toFixed(2)}`,
        order.delivery_status
      ];
    });

    // Add totals row
    tableData.push([
      '',
      '',
      `Total (${orderCount} orders)`,
      totalQuantity,
      `$${totalEarnings.toFixed(2)}`,
      ''
    ]);

    // Generate table
    autoTable(doc, {
      startY: 50,
      head: [['Date', 'Order ID', 'Products', 'Qty', 'Your Earnings', 'Status']],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 25 },  // Date
        1: { cellWidth: 20 },  // Order ID
        2: { cellWidth: 'auto', minCellWidth: 50 },  // Products
        3: { cellWidth: 15, halign: 'right' },  // Quantity
        4: { cellWidth: 25, halign: 'right' },  // Earnings
        5: { cellWidth: 25 }  // Status
      },
      headStyles: {
        fillColor: [0, 0, 51],  // Dark blue header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]  // Gray alternate rows
      },
      margin: { left: 14 }
    });

    // Save PDF
    doc.save(`seller_sales_${new Date().toISOString().slice(0, 10)}.pdf`);

  } catch (error) {
    console.error('PDF Export Error:', error);
    alert(`Failed to generate PDF: ${error.message}`);
  }
};