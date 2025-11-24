import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MoodBarChart({ userId, refresh }) {
  const [entries, setEntries] = useState([]);

  // Fetch mood entries
  useEffect(() => {
    axios.get(`http://localhost:5000/api/entries/${userId}`)
      .then((res) => {
        const recent = res.data
          .reverse()
          .filter((e) => e.mood)
          .slice(0, 30);
        setEntries(recent);
      })
      .catch((err) => console.error('Error fetching mood data:', err));
  }, [userId, refresh]);

  // Mood color map
  const moodColors = {
    Happy: '#4caf50',
    Sad: '#2196f3',
    Angry: '#f44336',
    Excited: '#ff9800',
    Scared: '#9c27b0',
    Calm: '#14b60bff',
    Tired: '#795548',
    Lonely: '#607d8b',
  };

  // Group mood counts
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {});

  const labels = Object.keys(moodCounts);
  const counts = Object.values(moodCounts);
  const colors = labels.map((mood) => moodColors[mood] || '#cccccc'); // fallback color

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Count (Last 30 Entries)',
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mood',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px', marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
