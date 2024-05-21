import express from 'express';
import fetch from 'node-fetch'; // Use node-fetch for server-side requests
import path from 'path';

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

const apiKey = process.env.NASA_API_KEY;

if (!apiKey) {
    throw new Error('Missing NASA API Key! Set the NASA_API_KEY environment variable.');
}

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
//app.use(express.static('public'));

// Route to serve index.html with NASA_API_KEY embedded
app.get('/', (req, res) => {
    res.render('index', { NASA_API_KEY: apiKey });
});

app.get('/neo-data', async (req, res) => {
    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed?api_key=';
    const today = new Date().toISOString().split('T')[0]; // Get today's date

    try {
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
