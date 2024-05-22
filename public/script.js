// Neo data section
const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');
const today = new Date().toISOString().split('T')[0];

const getNeoData = async () => {
    try {
        const response = await fetch('/neo-data');
        if (!response.ok) {
            throw new Error(`Error fetching NEO data: ${response.status}`);
        }
        const data = await response.json();
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
    } else {
        // Handle potential data structure changes or missing data
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.textContent = 'Error processing NEO data.';
        emptyCell.colSpan = 3; // Span across all columns
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    }
};

let isButtonClicked = false;

toggleDataBtn.addEventListener('click', async () => {
    if (isButtonClicked) {
        // Hide NEO data on button click
        neoContainer.style.display = 'none';
        toggleDataBtn.textContent = 'Learn More';
    } else {
        // Fetch and display NEO data on button click
        await getNeoData();
        neoContainer.style.display = 'block';
        toggleDataBtn.textContent = 'Close Table';
    }
    isButtonClicked = !isButtonClicked;
});

// Astronomy Picture of the Day section
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-bar');
const apodContainer = document.getElementById('apod-container');

const getEarthData = async (date) => {
  try {
    const response = await fetch(`/get-earth-data?date=${date}`); // Fetch from server-side endpoint
    if (!response.ok) {
      throw new Error('Error fetching Earth data');
    }
    const data = await response.json();
    updateEarthDisplay(data);
  } catch (error) {
    console.error('Error fetching Earth data:', error);
    // Handle errors (e.g., display error message to user)
  }
};

searchBtn.addEventListener('click', async () => {
    const selectedDate = searchInput.value;
    if (selectedDate) {
        await getApodData(selectedDate);
    } else {
        // Handle empty date input (e.g., display error message to user)
        console.error('Please select a date.');
    }
});

const updateApodDisplay = (data) => {
    apodContainer.innerHTML = ''; // Clear previous content
    // Process and display APOD data here
    // For example:
    const apodTitle = document.createElement('h3');
    apodTitle.textContent = data.title;
    apodContainer.appendChild(apodTitle);

    if (data.media_type === 'image') {
        const apodElement = document.createElement('img');
        apodElement.src = data.url;
        apodElement.alt = data.title;
        apodContainer.appendChild(apodElement);
    } else if (data.media_type === 'video') {
        const apodElement = document.createElement('iframe');
        apodElement.src = data.url;
        apodElement.title = data.title;
        apodContainer.appendChild(apodElement);
    } else {
        // Handle other media types (optional)
        const explanation = document.createElement('p');
        explanation.textContent = 'No image or video available for this date.';
        apodContainer.appendChild(explanation);
    }

    if (data.explanation) {
        const explanation = document.createElement('p');
        explanation.textContent = data.explanation;
        apodContainer.appendChild(explanation);
    }
};
