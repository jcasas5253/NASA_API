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
        const hazardousCell = document.createElement('td');
        hazardousCell.textContent = isPotentiallyHazardous ? 'Yes' : 'No';
        tableRow.appendChild(hazardousCell);

        tableBody.appendChild(tableRow);
      }
    } else {
      // Handle case where no near-earth objects are found
      tableBody.innerHTML = '<tr><td colspan="3">No Near-Earth Objects Found Today</td></tr>';
    }
  } else {
    // Handle case where data is missing or invalid
    tableBody.innerHTML = '<tr><td colspan="3">Error: Unable to process NEO data</td></tr>';
  }
};

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

const toggleDataBtn = document.getElementById('toggleDataBtn');
const getSpaceNewsBtn = document.getElementById('getSpaceNewsBtn');

toggleDataBtn.addEventListener('click', async () => {
    // Call the function to toggle data when the toggleDataBtn is clicked
    await processNeoData();
});

getSpaceNewsBtn.addEventListener('click', async () => {
    // Call the function to fetch space news when the getSpaceNewsBtn is clicked
    await getSpaceNews();
});
