const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// In-memory storage of mockData
let mockData = [
  { cityAndState: 'New York, NY', count: 5 },
  { cityAndState: 'Los Angeles, CA', count: 3 },
  { cityAndState: 'Chicago, IL', count: 8 },
  { cityAndState: 'Houston, TX', count: 2 }
];

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from 'client' folder
app.use(express.static(path.join(__dirname, '../client')));

// Handle form submission and add data to mockData
app.post('/new-location', (req, res) => {
  // Extract form data from the request (state and city fields)
  const state = req.body.state;
  const city = req.body.city;

  // Ensure both `state` and `city` exist before concatenation
  if (!state || !city) {
    console.error("State or city is missing");
    res.redirect('/');
    return;
  }

  // Combine city and state into a single cityAndState string
  const cityAndState = `${city}, ${state}`;
  console.log(cityAndState + 'hello');

  // Check if the city already exists in mockData using findIndex
  const cityIndex = mockData.findIndex(entry => entry.cityAndState === cityAndState);

  if (cityIndex >= 0) {
    // If the city exists, increment its count
    mockData[cityIndex].count += 1;
  } else {
    // If the city doesn't exist, add it as a new entry
    mockData.push({ cityAndState, count: 1 });
  }

  // Log updated mockData for debugging
  console.log(mockData);

  // Redirect back to the root after form submission
  res.redirect('/');
});

// Serve location data for the chart
app.get('/location-data', (req, res) => {
  res.json(mockData); // Send updated mockData
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
