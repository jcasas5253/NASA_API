// Import necessary modules
import express from 'express';
import fetch from 'node-fetch';

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Define API key (set as environment variable)
const apiKey = process.env.NASA_API_KEY;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to fetch NEO data
app.get('/neo-data', async (req, res) => {
  const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed?api_key=';
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(`${baseUrl}${apiKey}&start_date=${today}&end_date=${today}`);
    if (!response.ok) {
      throw new Error(`Error fetching NEO data: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch APOD data
app.get('/apod-data', async (req, res) => {
  const date = req.query.date; // Get date from query parameter
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    const response = await fetch(url);
    console.log('X-RateLimit-Remaining (APOD data):', response.headers.get('X-RateLimit-Remaining'));
    if (!response.ok) {
      throw new Error(`Error fetching APOD data: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to serve index.html with NASA_API_KEY embedded (optional, security best practice)
app.get('/', (req, res) => {
  // Consider not sending the API key directly to the client-side. 
  // Implement logic to retrieve the API key securely on the client-side if necessary.
  // res.sendFile('index.html', { root: 'public', NASA_API_KEY: apiKey });
  res.sendFile('index.html', { root: 'public' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
