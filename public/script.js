const toggleDataBtn = document.getElementById('toggleDataBtn');
const neoContainer = document.getElementById('neo-container');
const neoTable = document.getElementById('neo-table');
const spaceNewsContainer = document.getElementById('space-news-container');
const today = new Date().toISOString().split('T')[0];

const themeBtn = document.getElementById('theme-btn');

let wiggleInterval;

function startWiggle() {
    wiggleInterval = setInterval(() => {
        themeBtn.classList.toggle('wiggle');
    }, 5000); // Wiggle every 5 seconds
}

startWiggle(); // Start the wiggle effect

themeBtn.addEventListener('click', () => {
    clearInterval(wiggleInterval); // Stop the wiggle effect when the button is clicked
});


document.getElementById('theme-btn').addEventListener('click', () => {
    const body = document.body;
    const button = document.getElementById('theme-btn');
    if (body.style.backgroundColor === 'rgb(40, 1, 55)' || body.style.backgroundColor === '#280137') {
        body.style.backgroundColor = 'black';
        button.style.backgroundColor = '#280137'; // Button color when body is black
        button.style.borderColor = '#280137'; // Border color when button is black
    } else {
        body.style.backgroundColor = '#280137';
        button.style.backgroundColor = 'black'; // Button color when body is #280137
        button.style.borderColor = 'black'; // Border color when button is #280137
    }
});

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
        // Hide X button if it exists
        const closeButton = document.getElementById('closeTableBtn');
        if (closeButton) closeButton.style.display = 'none';
    } else {
        // Fetch and display NEO data on button click
        await getNeoData();
        neoContainer.style.display = 'block';
        toggleDataBtn.style.display = 'none'; // Hide Learn More button
        // Create and append X button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.id = 'closeTableBtn';
        closeButton.classList.add('close-table-btn');
        // Insert the X button as the first child of neoContainer
        neoContainer.insertBefore(closeButton, neoContainer.firstChild);
    }
    isButtonClicked = !isButtonClicked;
});

// Event listener for X button on the table
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'closeTableBtn') {
        // Remove table
        neoContainer.style.display = 'none';
        // Hide X button
        event.target.style.display = 'none';
        // Show Learn More button
        toggleDataBtn.style.display = 'block';
    }
});

const getSpaceNewsBtn = document.getElementById('getSpaceNewsBtn');
const newsCard = document.getElementById('news-card');

getSpaceNewsBtn.addEventListener('click', async () => {
    // Call the function to fetch space news when the getSpaceNewsBtn is clicked
    await getSpaceNews();

    // Toggle the height of the card to 'auto' after fetching space news
    if (newsCard.style.height === '300px') {
        newsCard.style.height = 'auto';
    } else {
        newsCard.style.height = '300px';
    }

    // Hide news button
    getSpaceNewsBtn.style.display = "none";

    // Create and append Close News button for news section
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close News';
    closeButton.id = 'closeNewsBtn';
    closeButton.classList.add('btn', 'btn-secondary', 'mt-2');
    // Insert the Close News button after the news articles
    newsCard.insertAdjacentElement('afterend', closeButton);
});

document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'closeNewsBtn') {
        // Check if the button is currently visible
        if (event.target.style.display !== 'none') {
            // Remove articles and hide the news card
            spaceNewsContainer.innerHTML = '';
            newsCard.style.height = '300px'; // Reset height to 300px
            // Hide the Close News button for news section
            event.target.style.display = 'none';
            // Show the Fetch News button again
            getSpaceNewsBtn.style.display = 'block';
        }
    }
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
            });

            // Hide button
            getSpaceNewsBtn.style.display = 'none';

        } else {
            // Handle case where data.results is missing or empty
            console.warn("No space news articles found in the response.");
            spaceNewsContainer.innerHTML = 'No space news available at this time.';
            // Show the original "Get Space News" button
            getSpaceNewsBtn.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching space news:', error);
        spaceNewsContainer.innerHTML = 'An error occurred while fetching space news. Please try again later.';
        // Show the original "Get Space News" button
        getSpaceNewsBtn.style.display = 'block';
    }
};

function scrollToDescription() {
    const descriptionElement = document.getElementById("description");
    const desiredOffset = 100; // Adjust offset for desired space

    // Calculate the target position considering the offset
    const targetY = descriptionElement.getBoundingClientRect().top + window.scrollY - desiredOffset;

    smoothScrollTo(targetY, 1000); // Adjust duration for desired scroll speed
}

function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function step(currentTime) {
        if (!startTime) {
            startTime = currentTime;
        }

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // Ensure progress does not exceed 1

        window.scrollTo(0, startY + distance * easeInOutQuad(progress));

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    // Easing function for a smooth scroll effect
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(step);
}

// List of fun space facts
const spaceFacts = [
    "Space is completely silent.",
    "The hottest planet in our solar system is Venus.",
    "A day on Venus is longer than a year on Venus.",
    "There are more stars in the universe than grains of sand on Earth.",
    "The footprints on the Moon will be there for 100 million years.",
    "One million Earths could fit inside the Sun."
];

let currentFactIndex = 0;
const factDisplayDuration = 5000; // Duration to display each fact (5 seconds)

// Highlight the current pagination radio button
const highlightPaginationButton = (index) => {
    const buttons = document.querySelectorAll('.pagination-radio');
    buttons.forEach(button => {
        if (parseInt(button.getAttribute('data-index'), 10) === index) {
            button.checked = true;
        } else {
            button.checked = false;
        }
    });
};

// Function to update the displayed fact
const updateSpaceFact = (index) => {
    const factElement = document.getElementById('space-fact');
    factElement.textContent = spaceFacts[index];
    highlightPaginationButton(index);
};

// Initial fact display
updateSpaceFact(currentFactIndex);

// Set interval to update fact periodically
const intervalId = setInterval(() => {
    currentFactIndex = (currentFactIndex + 1) % spaceFacts.length;
    updateSpaceFact(currentFactIndex);
}, factDisplayDuration);

// Create pagination radio buttons
const createPagination = () => {
    const paginationContainer = document.getElementById('pagination-container');
    spaceFacts.forEach((_, index) => {
        const radioWrapper = document.createElement('div');
        radioWrapper.classList.add('form-check', 'form-check-inline');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'pagination-radio';
        radioButton.id = `pagination-radio-${index}`;
        radioButton.classList.add('form-check-input', 'pagination-radio');
        radioButton.setAttribute('data-index', index);

        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.setAttribute('for', `pagination-radio-${index}`);
        /*label.textContent = index + 1;*/

        radioButton.addEventListener('click', (event) => {
            currentFactIndex = parseInt(event.target.getAttribute('data-index'), 10);
            updateSpaceFact(currentFactIndex);
        });

        radioWrapper.appendChild(radioButton);
        radioWrapper.appendChild(label);
        paginationContainer.appendChild(radioWrapper);
    });
};

// Call createPagination to initialize pagination radio buttons
createPagination();
highlightPaginationButton(currentFactIndex);


//Quiz
document.addEventListener('DOMContentLoaded', (event) => {
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextButton = document.getElementById('next-question');
    const tryAgainButton = document.getElementById('try-again');
    const progressBar = document.getElementById('progress-bar');

    const spaceFacts = [
        {
            question: 'Is Venus hotter than Mercury?',
            correctAnswer: 'Yes',
        },
        {
            question: 'Does Mars have liquid water on its surface?',
            correctAnswer: 'No',
        },
        {
            question: 'How long does it take for the Sun to orbit the center of the Milky Way?',
            correctAnswer: '100 million years',
        },
        {
            question: 'How many stars are in the Milky Way galaxy?',
            correctAnswer: 'One million',
        }
    ];

    let currentQuestionIndex = 0;
    let userScore = 0;
    let userAnswers = [];

    const displayQuestion = (index) => {
        const currentQuestion = spaceFacts[index];
        questionElement.textContent = currentQuestion.question;
        answersElement.innerHTML = '';

        let options;
        switch (currentQuestion.correctAnswer) {
            case 'Yes':
            case 'No':
                options = ['Yes', 'No'];
                break;
            case '100 million years':
                options = ['100 million years', '10 years', '1 million years'];
                break;
            case 'One million':
                options = ['One million', '100 thousand', '1 billion'];
                break;
            default:
                options = ['Yes', 'No'];
        }

        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-secondary', 'm-2');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(button, option));
            answersElement.appendChild(button);
        });

        nextButton.style.display = 'none';
    };

    const handleAnswer = (button, selectedAnswer) => {
        const currentQuestion = spaceFacts[currentQuestionIndex];
        userAnswers[currentQuestionIndex] = selectedAnswer;
        answersElement.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        nextButton.style.display = 'block';
    };

    const updateProgressBar = () => {
        const progressPercentage = (currentQuestionIndex / spaceFacts.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    };

    const displayResults = () => {
        questionElement.textContent = `You scored ${userScore} out of ${spaceFacts.length}`;
        answersElement.innerHTML = '';

        spaceFacts.forEach((question, index) => {
            const resultP = document.createElement('p');
            resultP.textContent = question.question;

            const answerSpan = document.createElement('span');
            answerSpan.textContent = ` You answered: ${userAnswers[index]} - `;
            if (userAnswers[index] === question.correctAnswer) {
                answerSpan.classList.add('correct');
            } else {
                answerSpan.classList.add('incorrect');
            }
            resultP.appendChild(answerSpan);

            const correctAnswerSpan = document.createElement('span');
            correctAnswerSpan.textContent = `The correct answer is: ${question.correctAnswer}`;
            resultP.appendChild(correctAnswerSpan);

            answersElement.appendChild(resultP);
        });

        const helpMessage = document.createElement('h4');
        helpMessage.textContent = 'Check out the space facts if you are struggling!';
        answersElement.appendChild(helpMessage);

        nextButton.style.display = 'none';
        tryAgainButton.style.display = 'block';
    };

    const resetQuiz = () => {
        currentQuestionIndex = 0;
        userScore = 0;
        userAnswers = [];
        updateProgressBar();
        displayQuestion(currentQuestionIndex);
        tryAgainButton.style.display = 'none';
    };

    displayQuestion(currentQuestionIndex);

    nextButton.addEventListener('click', () => {
        const currentQuestion = spaceFacts[currentQuestionIndex];
        if (userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer) {
            userScore++;
        }
        currentQuestionIndex++;
        updateProgressBar();
        if (currentQuestionIndex < spaceFacts.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            displayResults();
        }
    });

    tryAgainButton.addEventListener('click', resetQuiz);
});

const spaceFactsContainer = document.getElementById('space-facts-container');

let touchStartX = 0;
let touchEndX = 0;

spaceFactsContainer.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

spaceFactsContainer.addEventListener('touchmove', (event) => {
    touchEndX = event.touches[0].clientX;
});

spaceFactsContainer.addEventListener('touchend', () => {
    const deltaX = touchEndX - touchStartX;
    const threshold = 50; // Adjust the threshold according to your preference

    if (deltaX > threshold) {
        // Swipe left
        showPreviousFact();
    } else if (deltaX < -threshold) {
        // Swipe right
        showNextFact();
    }
});

// Function to display the next fact
const showNextFact = () => {
    currentFactIndex = (currentFactIndex + 1) % spaceFacts.length;
    updateSpaceFact(currentFactIndex);
};

// Function to display the previous fact
const showPreviousFact = () => {
    currentFactIndex = (currentFactIndex - 1 + spaceFacts.length) % spaceFacts.length;
    updateSpaceFact(currentFactIndex);
};


const prevSlideBtn = document.getElementById('prev-slide-btn');
const nextSlideBtn = document.getElementById('next-slide-btn');

prevSlideBtn.addEventListener('click', showPreviousFact);
nextSlideBtn.addEventListener('click', showNextFact);