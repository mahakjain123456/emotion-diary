import React, { useState } from 'react';
import JournalForm from './components/JournalForm';
import MoodChart from './components/MoodChart';
import PastEntries from './components/PastEntries';
import MoodBarChart from './components/MoodBarChart';

const userId = 'demoUser123';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '300px',
          overflowY: 'auto',
          borderRight: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h3>Past Entries</h3>
        <PastEntries
          userId={userId}
          refresh={refresh}
          onDelete={() => setRefresh(!refresh)}
        />
      </div>

      {/* Main Panel */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        <h2>Journal Entry</h2>
        <JournalForm userId={userId} onSave={() => setRefresh(!refresh)} />


        <h3>Sentiment Chart</h3>
        <MoodChart userId={userId} refresh={refresh} />

        <h3>Mood Frequency Chart</h3>
        <MoodBarChart userId={userId} refresh={refresh} />
      </div>
    </div>
  );
}

export default App;
