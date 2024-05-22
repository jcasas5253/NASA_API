const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');
const spaceNewsContainer = document.getElementById('space-news-container');

const getNeoData = async () => {
  try {
    const response = await fetch('/neo-data');
    if (!response.ok) {
      throw new Error(`Error fetching NEO data: ${response.status}`);
    }
    const data = await response.json();

    // Process NEO data and populate the table
    processNeoData(data);

  } catch (error) {
    console.error('Error fetching NEO data:', error);
    // Handle errors (e.g., display error message to user)
  }
};

const processNeoData = (data) => {
  const tableBody = document.getElementById('neo-table').getElementsByTagName('tbody')[0];

  // Clear existing table content
  tableBody.innerHTML = '';

  if (data.near_earth_objects && data.near_earth_objects.hasOwnProperty(today)) {
    const nearEarthObjects = data.near_earth_objects[today];

    if (nearEarthObjects.length > 0) {
      // Loop through nearEarthObjects and create table rows
      for (const neo of nearEarthObjects) {
        const tableRow = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = neo.name;
        tableRow.appendChild(nameCell);

        const closeApproachDate = neo.close_approach_data[0].close_approach_date_full;
        const closeApproachDateCell = document.createElement('td');
        closeApproachDateCell.textContent = closeApproachDate;
        tableRow.appendChild(closeApproachDateCell);

        const isPotentiallyHazardous = neo.is_potentially_hazardous_asteroid;
        const hazardousCell = document.createElement
