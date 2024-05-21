const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

const apiKey = process.env.NASA_API_KEY;

if (!apiKey) {
    throw new Error('Missing NASA API Key! Set the NASA_API_KEY environment variable.');
}

app.get('/neo-data', async (req, res) => {
    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed?api_key=';
    const today = new Date().toISOString().split('T')[0]; // Get today's date

    try {
        // Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${baseUrl}${apiKey}&start_date=${today}&end_date=${today}`);
        if (!response.ok) {
            throw new Error(`Error fetching NEO data: ${response.status}`);
        }
        const data = await response.json();
        // Process the data here if needed (optional)
        res.json(data); // Send the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching NEO data:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
