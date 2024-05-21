// Neo data section
const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');

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
