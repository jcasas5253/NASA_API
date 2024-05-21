// Import necessary modules
import express from 'express';
import fetch from 'node-fetch';

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Define API key
const apiKey = process.env.NASA_API_KEY;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set up a route to fetch NEO data
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

// Route to serve index.html with NASA_API_KEY embedded
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public', NASA_API_KEY: apiKey });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
