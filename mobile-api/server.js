const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());

// Read phones data with error handling
let phones;
try {
  phones = JSON.parse(fs.readFileSync('./phones.json', 'utf-8'));
} catch (error) {
  console.error('Error reading or parsing phones.json:', error);
  phones = []; // Fallback to an empty array if file reading/parsing fails
}

// Get all phones
app.get('/api/phones', (req, res) => {
  if (phones.length === 0) {
    return res.status(500).json({ message: 'No phones data available' });
  }
  res.json(phones);
});

// Get phone by model name (case-insensitive)
app.get('/api/phones/:model', (req, res) => {
  const model = req.params.model.toLowerCase();
  const phone = phones.find(p => p.model.toLowerCase() === model);
  if (phone) {
    res.json(phone);
  } else {
    res.status(404).json({ message: 'Phone not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
