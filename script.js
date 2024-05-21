const apiKey = process.env.NASA_API_KEY; // Replace with your actual NASA API key

// Neo data section
const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');

const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

const getNeoData = async () => {
    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed?api_key='; // NASA NEO API base URL
    const endDate = today; // Use today's date for NEO data

    try {
        const response = await fetch(`${baseUrl}${apiKey}&start_date=${today}&end_date=${endDate}`);
        if (!response.ok) {
            throw new Error(`Error fetching NEO data: ${response.status}`);
        }
        const data = await response.json();

        // Process NEO data and populate the table
        const nearEarthObjects = data.near_earth_objects[endDate];
        const tableBody = document.getElementById('neo-table').getElementsByTagName('tbody')[0];

        // Clear existing table content
        tableBody.innerHTML = '';

        if (nearEarthObjects && nearEarthObjects.length > 0) {
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
                const hazardousCell = document.createElement('td');
                hazardousCell.textContent = isPotentiallyHazardous ? 'Yes' : 'No';
                tableRow.appendChild(hazardousCell);

                tableBody.appendChild(tableRow);
            }
        } else {
            // Handle no NEO data found for today
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.textContent = 'No Near-Earth Objects found for today.';
            emptyCell.colSpan = 3; // Span across all columns
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
        }
    } catch (error) {
        console.error('Error fetching NEO data:', error);
        // Handle errors (e.g., display error message to user)
    }
};

let isButtonClicked = false; // Flag to track button click state

toggleDataBtn.addEventListener('click', async () => {
    // ... existing code to toggle NEO data display ...
    if (isButtonClicked) {
        // Hide NEO data on button click
        neoContainer.style.display = 'none';
        toggleDataBtn.textContent = 'Learn More'; // Change button text to "Learn More"
    } else {
        // Fetch and display NEO data on button click
        await getNeoData();
        neoContainer.style.display = 'block';
        toggleDataBtn.textContent = 'Close Table'; // Change button text to "Close Table"
    }
    isButtonClicked = !isButtonClicked;
});

// APOD data section
async function getApodData(date) {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
    const data = await response.json();
    return data;
}

const apodContainer = $('#apod-container'); // Use jQuery selector for the container

const updateApodDisplay = (data) => {
  apodContainer.empty(); // Clear content using jQuery

  if (data.media_type === 'image' || data.media_type === 'video') {
    const apodElement = data.media_type === 'image' ? document.createElement('img') : document.createElement('iframe');
    apodElement.src = data.url;
    apodElement.alt = data.title;
    apodElement.className = "apodImg"; // Add class for styling
    apodContainer.append(apodElement);

    // Create close button (hidden initially) using jQuery
    const closeApodBtn = $('<button>').text('x').addClass('close-apod');
    apodContainer.append(closeApodBtn);

    // Show close button only when there's an APOD
    closeApodBtn.show();

    closeApodBtn.click(() => {
      apodContainer.empty(); // Clear APOD content
      closeApodBtn.hide(); // Hide close button on click
    });
  } else {
    // Handle non-image/video data (optional)
    apodContainer.text('No image or video available for this date.'); // Add placeholder text
    // Hide close button if there's no APOD
    $('#close-apod-btn').hide(); // Use jQuery selector to target existing button
  }

  const apodTitle = document.createElement('h3');
  apodTitle.textContent = data.title;
  apodContainer.append(apodTitle);

  // Add explanation text or link
  if (data.explanation) {
    const explanation = document.createElement('p');
    explanation.textContent = data.explanation;
    explanation.classList.add('apod-explanation'); // Add a class for styling
    apodContainer.append(explanation);
  }
};

// Search button click event listener (ensure no typos)
$('#search-btn').click(async () => {
    const searchDate = $('#search-bar').val();
    if (!searchDate) return; // Handle empty search

    const apodData = await getApodData(searchDate);
    updateApodDisplay(apodData);
});
