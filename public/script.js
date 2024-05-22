const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');
const spaceNewsContainer = document.getElementById('space-news-container'); 
const today = new Date().toISOString().split('T')[0];

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

const getSpaceNews = async () => {
  try {
    const response = await fetch('/space-news');
    if (!response.ok) {
      throw new Error(`Error fetching space news: ${response.status}`);
    }
    const data = await response.json();

    // Check if data.results exists before iterating
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      // Process space news data and create HTML elements here
      spaceNewsContainer.innerHTML = ''; // Clear existing content
      
      // Limit the results to top 4 articles
      const topArticles = data.results.slice(0, 4);
      
      topArticles.forEach(article => {
        const articleContainer = document.createElement('div');
        articleContainer.classList.add('article'); // Add CSS class for styling

        // Create elements for title, description, and link
        const titleElement = document.createElement('h3');
        titleElement.textContent = article.title;
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = article.summary;
        const linkElement = document.createElement('a');
        linkElement.href = article.url;
        linkElement.className = 'btn btn-primary mt-3'; // Add button classes
        linkElement.textContent = 'Read More';
        linkElement.target = '_blank'; // Set target attribute to _blank

        // Add elements to the article container and append it to the spaceNewsContainer
        articleContainer.appendChild(titleElement);
        articleContainer.appendChild(descriptionElement);
        articleContainer.appendChild(linkElement);

        spaceNewsContainer.appendChild(articleContainer);

        //hide button
        getSpaceNewsBtn.style.display = 'none';
        
      });
    } else {
      // Handle case where data.results is missing or empty
      console.warn("No space news articles found in the response.");
      spaceNewsContainer.innerHTML = 'No space news available at this time.';
    }

  } catch (error) {
    console.error('Error fetching space news:', error);
    spaceNewsContainer.innerHTML = 'An error occurred while fetching space news. Please try again later.';
  }
}

const getSpaceNewsBtn = document.getElementById('getSpaceNewsBtn');

getSpaceNewsBtn.addEventListener('click', async () => {
    // Call the function to fetch space news when the getSpaceNewsBtn is clicked
    await getSpaceNews();
});

function scrollToDescription(desiredOffset) {
  return (req, res) => {

    const descriptionElementId = 'description';

    // Get the target position considering offset (server-side)
    const targetY = document.getElementById(descriptionElementId).offsetTop - desiredOffset;

    // Execute the scroll animation on the client-side using JavaScript
    // Send the targetY value to the client
    res.locals.targetY = targetY;
  };
}

module.exports = scrollToDescription;
