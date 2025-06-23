import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, // X-axis (year/weeks)
  LinearScale, // Y-axis (cases)
  PointElement, // Data points
  LineElement,
  Title,
  Tooltip // Shows cases for the week on hover
);

const DengueChart = ({ data, title, color = '#10B981' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">  
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="flex justify-center items-center h-80">
            <p className="text-base-content/50">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.date), // X-axis labels ["2014-W01", "2014-W02", ...]
    datasets: [
      {
        label: 'Cases',
        data: data.map(item => item.cases), // Y-axis values [number of cases]
        borderColor: color, // Line color
        backgroundColor: `${color}20`, // Fill color
        tension: 0.1, // Line curve smoothness
        pointBackgroundColor: color, // Data point fill color
        pointBorderColor: color, // Data point border color
        pointRadius: 4, // Point size
        pointHoverRadius: 6, // Hover size
      },
    ],
  };

  const options = {
    responsive: true, // Adapts to container size
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      title: { // Chart title
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: { // Hover tooltip config
        callbacks: {
          label: function(context) {
            return `Cases: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value;
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 20, // Prevent overcrowded X-axis labels
        },
      },
    },
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="h-80"> {/* Fixed height: 320px */}
          <Line data={chartData} options={options} /> {/* Chart js line component */}
        </div>
      </div>
    </div>
  );
};

export default DengueChart;

// Input data from useDengueData hook:
// data = [
//   { date: "2014-W01", cases: 436, year: 2014, week: 1 },
//   { date: "2014-W02", cases: 479, year: 2014, week: 2 },
// ...
// ]

// Chart.js receives:
// chartData = {
//   labels: ["2014-W01", "2014-W02", ...],
//   datasets: [{
//     data: [436, 479, ...],
//     borderColor: "#10B981",
//     ... styling
//   }]
// }
