// src/components/HorizontalBarChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function HorizontalBarChart({ data, maxValue }) {

  const options = {
    indexAxis: 'y', // makes it horizontal
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      /*title: { display: true, text: 'Monthly Revenue & Cost' },*/
    },
    scales: {
      x: { beginAtZero: true, max: maxValue },
    },
  };

  return <Bar data={data} options={options} />;
}
