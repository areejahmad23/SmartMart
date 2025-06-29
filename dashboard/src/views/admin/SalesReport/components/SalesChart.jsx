import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = ({ data }) => {
  // Process data to get daily sales from orders
  const dailySales = data.reduce((acc, order) => {
    const date = order.date; // Now using the order's date directly
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.orderTotal; // Using the orderTotal from the order
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(dailySales).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: sortedDates.map(date => dailySales[date]),
        borderColor: '#0077cc',
        backgroundColor: 'rgba(0, 119, 204, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#0077cc',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000033',
          font: {
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: '#000033',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#0077cc',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
          footer: (tooltipItems) => {
            // Show number of orders for this day in tooltip footer
            const date = tooltipItems[0].label;
            const ordersCount = data.filter(order => order.date === date).length;
            return `Orders: ${ordersCount}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#666',
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="h-80">
      {sortedDates.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No chart data available
        </div>
      )}
    </div>
  );
};

export default SalesChart;