import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// CSV Export Function (Fixed to match frontend exactly)
export const exportToCSV = (data) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No sales data available to export');
    }

    // Prepare CSV headers (matches frontend columns)
    const headers = ['Date', 'Order ID', 'Products', 'Total'];
    
    // Process each order into CSV rows
    const rows = data.map(order => {
      // Combine all product names with commas
      const products = order.products.map(p => p.name).join(', ');
      
      return [
        order.date,  // Date (format: YYYY-MM-DD)
        order._id.toString().slice(-6),  // Last 6 chars of Order ID
        products.includes(',') ? `"${products}"` : products,  // Quote-wrapped if contains commas
        `$${order.orderTotal.toFixed(2)}`  // Formatted total
      ];
    });

    // Calculate and add totals row (matches frontend format)
    const orderCount = data.length;
    const grandTotal = data.reduce((sum, order) => sum + order.orderTotal, 0);
    rows.push([
      '',  // Empty date
      '',  // Empty order ID
      `Total (${orderCount} orders)`,  // Matches frontend label
      `$${grandTotal.toFixed(2)}`  // Formatted total
    ]);

    // Generate CSV content
    const csvContent = [
      headers.join(','),  // Header row
      ...rows.map(row => row.join(','))  // Data rows
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`;
    saveAs(blob, fileName);

  } catch (error) {
    console.error('CSV Export Error:', error);
    alert(`Failed to generate CSV: ${error.message}`);
  }
};

// PDF Export Function (Matches frontend table)
export const exportToPDF = (data, dateRange) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No sales data available to export');
    }

    // Initialize PDF
    const doc = new jsPDF();
    const orderCount = data.length;
    const grandTotal = data.reduce((sum, order) => sum + order.orderTotal, 0);

    // Title and date range
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 20);
    doc.setFontSize(12);
    doc.text(
      `From ${dateRange.startDate.toDateString()} to ${dateRange.endDate.toDateString()}`,
      14, 30
    );

    // Prepare table data
    const tableData = data.map(order => [
      order.date,
      order._id.toString().slice(-6),
      order.products.map(p => p.name).join(', '),
      `$${order.orderTotal.toFixed(2)}`
    ]);

    // Add totals row (matches frontend)
    tableData.push([
      '',
      '',
      `Total (${orderCount} orders)`,
      `$${grandTotal.toFixed(2)}`
    ]);

    // Generate table
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Order ID', 'Products', 'Total']],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 25 },  // Date
        1: { cellWidth: 20 },  // Order ID
        2: { cellWidth: 'auto', minCellWidth: 60 },  // Products
        3: { cellWidth: 25, halign: 'right' }  // Total
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
    doc.save(`sales_report_${new Date().toISOString().slice(0, 10)}.pdf`);

  } catch (error) {
    console.error('PDF Export Error:', error);
    alert(`Failed to generate PDF: ${error.message}`);
  }
};