import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function MoodChart({ userId }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/entries/${userId}`)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setEntries(sorted);
      })
      .catch((err) => console.error('Error fetching entries:', err));
  }, [userId]);

  const labels = entries.map((e) =>
    new Date(e.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Sentiment Score',
        data: entries.map((e) => e.sentimentScore),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.3)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
          text: 'Date & Time',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sentiment Score',
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  // Width of the chart canvas (7 entries at a time, 150px per entry)
  const chartWidth = Math.max(entries.length * 150, 1050);

  return (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <div style={{ minWidth: `${Math.max(entries.length, 7) * 150}px`, height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  </div>
);

}
