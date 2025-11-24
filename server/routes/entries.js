const express = require('express');
const router = express.Router();
const Sentiment = require('sentiment');
const Entry = require('../models/entry');

const sentiment = new Sentiment();

router.post('/add', async (req, res) => {
  console.log('Incoming entry:', req.body);
  const { userId, text, mood } = req.body; 
  const result = sentiment.analyze(text);
  const entry = new Entry({
    userId,
    text,
    mood,
    sentimentScore: result.score
  });
  await entry.save();
  res.json({ message: 'Entry saved', score: result.score });
});


router.get('/:userId', async (req, res) => {
  const entries = await Entry.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(entries);
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: 'Could not delete entry' });
  }
});


module.exports = router;