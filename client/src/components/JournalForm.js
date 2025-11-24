import React, { useState } from 'react';
import axios from 'axios';

export default function JournalForm({ userId, onSave }) 
 {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post('http://localhost:5000/api/entries/add', {
      userId,
      text,
      mood,
    });

    setText('');
    setMood('');
    
    // Trigger chart + past entries refresh
    if (onSave) onSave();
  } catch (err) {
    console.error('Error saving entry:', err);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h3> How was your day Today ? </h3>
      <select
  value={mood}
  onChange={(e) => setMood(e.target.value)}
  required
  style={{ width: '100%', marginBottom: '10px' }}
>
  <option value="">Select Mood</option>
  <option value="Happy">😊 Happy</option>
  <option value="Sad">😢 Sad</option>
  <option value="Angry">😠 Angry</option>
  <option value="Excited">🤩 Excited</option>
  <option value="Scared">😱 Scared</option>
  <option value="Calm">😌 Calm</option>
  <option value="Tired">😴 Tired</option>
  <option value="Lonely">🥺 Lonely</option>
</select>


      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write about your day..."
        rows={5}
        style={{ width: '100%' }}
      />
      <button type="submit">Analyze & Save</button>
    </form>
  );
}