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

const SalesChart = ({ data, dateRange, commissionRate = 0.8 }) => {
  // Group earnings by date with commission applied
  const dailyEarnings = data.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const dayEarnings = order.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity * commissionRate);
    }, 0);
    
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += dayEarnings;
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(dailyEarnings).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Your Daily Earnings ($)',
        data: sortedDates.map(date => dailyEarnings[date]),
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
            const date = tooltipItems[0].label;
            const ordersCount = data.filter(order => 
              new Date(order.createdAt).toLocaleDateString() === date
            ).length;
            return `Orders: ${ordersCount}`;
          }
        }
      },
      title: {
        display: true,
        text: `Earnings from ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`,
        color: '#000033',
        font: {
          size: 16
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
          No earnings data available
        </div>
      )}
    </div>
  );
};

export default SalesChart;