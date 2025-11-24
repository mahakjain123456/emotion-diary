import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PastEntries({ userId, refresh, onDelete }) {
 
  const [entries, setEntries] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Fetch entries sorted by newest first
  useEffect(() => {
    axios.get(`http://localhost:5000/api/entries/${userId}`)
      .then((res) => {
        setEntries(res.data); // entries already sorted from backend
      })
      .catch((err) => console.error('Error loading entries:', err));
  }, [userId, refresh]);

  const toggleEntry = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const deleteEntry = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/entries/delete/${id}`);
    setEntries(entries.filter((e) => e._id !== id));

    
    if (onDelete) onDelete();
  } catch (err) {
    console.error('Error deleting entry:', err);
  }
};


  return (
    <div>
      {entries.map((entry, index) => {
        const isOpen = expandedIndex === index;

        return (
          <div
            key={entry._id}
            onClick={() => toggleEntry(index)}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isOpen ? '#f9f9f9' : '#fff',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '0.8em', color: '#555' }}>
              {new Date(entry.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>

            <div style={{ fontWeight: 'bold' }}>
              Sentiment Score: {entry.sentimentScore}
            </div>

            <div style={{ fontStyle: 'italic', color: '#666' }}>
              Mood: {entry.mood || 'Not set'}
            </div>

            {isOpen && (
              <div style={{ marginTop: '8px' }}>
                {entry.text}
              </div>
            )}

            
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent click from toggling
                deleteEntry(entry._id);
              }}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                color: '#e74c3c',
                cursor: 'pointer',
              }}
              title="Delete Entry"
            >
              🗑️
            </button>
          </div>
        );
      })}
    </div>
  );
}
