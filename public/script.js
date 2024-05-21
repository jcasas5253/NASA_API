const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const apodContainer = document.getElementById('apod-container');

const getNeoData = async () => {
  try {
    const response = await fetch('/neo-data');
    if (!response.ok) {
      throw new Error(`Error fetching NEO data: ${response.status}`);
    }
    const data = await response.json();
    // Process NEO data and populate the table
    // ...
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    // Handle errors (e.g., display error message to user)
  }
};

const getApodData = async (date) => {
  try {
    const response = await fetch(`/apod-data?date=${date}`);
    if (!response.ok) {
      throw new Error(`Error fetching APOD data: ${response.status}`);
    }
    const data = await response.json();
    displayApod(data);
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    // Handle errors (e.g., display error message to user
