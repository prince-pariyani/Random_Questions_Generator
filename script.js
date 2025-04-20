// Apply saved theme when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
});


// Questions data
const questions = {
    random: [
        "If you could have any superpower, what would it be and why?",
        "What's the most interesting thing you've learned this week?",
        "If you could time travel, would you go to the past or future?",
        "What's your favorite way to spend a rainy day?",
        "If your memories were erased, would you still be you?",
        "Are we truly in control of our actions, or are we just passengers in a deterministic universe?",
        "Would immortality be a blessing or a curse?",
        "What's the most important lesson you've learned in life?",
        "If a morally good act is done for selfish reasons, is it still good?"
    ], // Added comma here
    food: [
        "If you could only eat one cuisine for the rest of your life, what would it be?",
        "What's the weirdest food combination you secretly enjoy?",
        "If you could have dinner with any historical figure, who would it be and what would you serve?",
        "What's your ultimate comfort food and why?",
    ],
    animals: [
        "If you could communicate with one animal species, which would you choose?",
        "What's your spirit animal and why?",
        "If you could have any animal as a pet (regardless of practicality), what would you choose?",
        "What's the most interesting animal fact you know?",
    ],
    philosophy: [
        "What does happiness mean to you?",
        "If you could change one thing about the world, what would it be?",
        "What's your personal philosophy on life?",
        "Do you believe in fate or free will? Why?",
    ],
    truth: [
        "What's the most embarrassing thing that happened to you in school?",
        "Have you ever pretended to be sick to avoid something? What was it?",
        "What's a secret you've never told anyone?",
        "What's the biggest lie you've ever told?",
        "What's something you regret buying?",
        "Who is your secret crush?",
    ],
    dare: [
        "Do 10 push-ups right now.",
        "Sing the chorus of your favorite song out loud.",
        "Talk in a funny accent for the next 3 minutes.",
        "Try to lick your elbow.",
        "Send a text to the first person in your contacts saying 'Hey!'",
        "Do your best impression of a celebrity.",
    ],
    rapidfire: [
        { q: "What’s your love language?", options: ["Physical Touch", "Quality Time"] },
        { q: "What’s more romantic?", options: ["A handwritten letter", "A grand surprise under the stars"] },
        { q: "When do you feel most vulnerable?", options: ["When I open up emotionally", "When I say “I love you” first"] },
        { q: "What melts your heart the most?", options: ["Someone remembering tiny details", "A soft kiss on the forehead"] },
        { q: "What do you fear more?", options: ["Losing people I love", "Being misunderstood"] },
        { q: "Would you rather be…", options: ["Remembered forever", "Unseen but deeply loved"] },
        { q: "Coffee or Tea?", options: ["Coffee", "Tea"] },
        { q: "The lie you tell yourself most often?", options: ["I'll do it later", "I don’t care"] },
        { q: "Cats or Dogs?", options: ["Cats", "Dogs"] },
        { q: "Beach or Mountains?", options: ["Beach", "Mountains"] },
        { q: "Sweet or Savory?", options: ["Sweet", "Savory"] },
        { q: "Morning Person or Night Owl?", options: ["Morning Person", "Night Owl"] },
        { q: "Pizza or Tacos?", options: ["Pizza", "Tacos"] },
        { q: "Book or Movie?", options: ["Book", "Movie"] },
        { q: "Summer or Winter?", options: ["Summer", "Winter"] },
        { q: "Call or Text?", options: ["Call", "Text"] },
        { q: "Comedy or Drama?", options: ["Comedy", "Drama"] }
    ]
};

// Utility functions
function getRandomQuestion(category) {
    let questionList;
    let type = ''; // To store 'Truth' or 'Dare'

    if (category === 'truth') { // Explicitly request truth
        questionList = questions.truth;
        type = 'Truth';
    } else if (category === 'dare') { // Explicitly request dare
        questionList = questions.dare;
        type = 'Dare';
    } else if (category === 'truthordare') { // Randomly pick one
        const isTruth = Math.random() < 0.5;
        questionList = isTruth ? questions.truth : questions.dare;
        type = isTruth ? 'Truth' : 'Dare';
    } else if (category === 'rapidfire') {
        questionList = questions.rapidfire;
        // No type needed for rapid fire here
    } else {
        questionList = questions[category] || questions.random; // Default to random for standard categories
    }

    if (!questionList || questionList.length === 0) {
        return { text: "Oops! No questions found for this category.", type: '' };
    }

    const randomIndex = Math.floor(Math.random() * questionList.length);
    const text = questionList[randomIndex];

    // Return an object including the type (relevant for T/D)
    return { text, type };
}

function saveAnswer(answer) {
    const answers = JSON.parse(localStorage.getItem('answers') || '[]');
    answers.push({
        ...answer,
        id: Date.now(),
        // timestamp is added directly when calling saveAnswer now
    });
    localStorage.setItem('answers', JSON.stringify(answers));
}

function getAnswers() {
    return JSON.parse(localStorage.getItem('answers') || '[]');
}

// Event Listeners for Category Selection (on index.html)
document.addEventListener('DOMContentLoaded', () => {
    // Ensure this only runs on index.html potentially
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                window.location.href = `question.html?category=${category}`;
            });
        });
    }
});


// Question Page Functionality
if (window.location.pathname.includes('question.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'random';
        const questionTextElement = document.querySelector('.question-text');
        const answerForm = document.querySelector('.answer-form');
        const answerTextarea = document.querySelector('textarea');
        const resultDiv = document.querySelector('.result');
        const changeQuestionButton = document.querySelector('.change-question-button');
        const pageTitle = document.querySelector('title');
        const mainTitle = document.querySelector('.question-container .title');

        function loadNewQuestion() {
            const questionData = getRandomQuestion(category); // Get question object
            const questionText = questionData.text; // Extract text

            questionTextElement.textContent = questionText; // Display only the text

            answerTextarea.value = '';
            resultDiv.classList.add('hidden');
            answerForm.style.display = 'flex'; // Ensure form is visible
            answerForm.classList.remove('hidden');

            // Update titles
            let dynamicTitle = category.charAt(0).toUpperCase() + category.slice(1);
            if (pageTitle) {
                 pageTitle.textContent = `${dynamicTitle} Question - Random Questions & Letters`;
            }
            if (mainTitle) {
                 mainTitle.textContent = `${dynamicTitle} Question`;
            }
        }

        if (questionTextElement) {
            loadNewQuestion();
        }

        if (changeQuestionButton) {
             changeQuestionButton.addEventListener('click', loadNewQuestion);
        }

        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const answer = answerTextarea.value;
                const currentQuestion = questionTextElement.textContent;

                saveAnswer({
                    question: currentQuestion,
                    answer,
                    category: category,
                    timestamp: new Date().toISOString() // Add timestamp here
                });

                // Show result
                resultDiv.innerHTML = `
                    <h2>Your Answer:</h2>
                    <p>${answer}</p>
                    <button class="get-new-question-button">Get New Question</button>
                `;
                resultDiv.classList.remove('hidden');
                answerForm.classList.add('hidden');

                const getNewQuestionButton = resultDiv.querySelector('.get-new-question-button');
                if (getNewQuestionButton) {
                    getNewQuestionButton.onclick = loadNewQuestion;
                }
            });
        }
    });
}

// --- Truth or Dare Page Logic ---
if (window.location.pathname.includes('truth-or-dare.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const outputElement = document.getElementById('truth-dare-output');
        const getTruthButton = document.getElementById('get-truth-button');
        const getDareButton = document.getElementById('get-dare-button');
        const getNextRandomButton = document.getElementById('get-next-random-button');

        function displayTruthOrDare(questionData) {
            if (!outputElement || !questionData) return;

            const { text, type } = questionData;

            if (type) {
                 outputElement.innerHTML = `<strong class="question-type ${type.toLowerCase()}">${type}:</strong> ${text}`;
            } else {
                 outputElement.textContent = text; // Fallback
            }
        }

        if (getTruthButton) {
            getTruthButton.addEventListener('click', () => {
                const questionData = getRandomQuestion('truth');
                displayTruthOrDare(questionData);
            });
        }

        if (getDareButton) {
             getDareButton.addEventListener('click', () => {
                const questionData = getRandomQuestion('dare');
                displayTruthOrDare(questionData);
            });
        }

        if (getNextRandomButton) {
            getNextRandomButton.addEventListener('click', () => {
                const questionData = getRandomQuestion('truthordare');
                displayTruthOrDare(questionData);
            });
        }
    });
}
// --- End Truth or Dare Logic ---


// --- Rapid Fire Page Logic ---
let rapidFireIndex = 0;
let rapidFireTimeoutId = null; // Timeout to advance question if user doesn't click
const RAPID_FIRE_TIME_LIMIT = 5; // Seconds

function displayNextRapidFireQuestion() {
    // Clear any existing timeout
    if (rapidFireTimeoutId) {
        clearTimeout(rapidFireTimeoutId);
        rapidFireTimeoutId = null;
    }

    const questionElement = document.getElementById('rapid-fire-question');
    const option1Button = document.getElementById('rapid-fire-option1');
    const option2Button = document.getElementById('rapid-fire-option2');
    const timerBarContainer = document.querySelector('.timer-bar-container'); // Get container
    const timerBar = document.querySelector('.timer-bar'); // Get the bar itself
    const optionsContainer = document.querySelector('.rapid-fire-options');
    const restartButton = document.getElementById('restart-rapid-fire');

    // Ensure all elements exist
    if (!questionElement || !option1Button || !option2Button || !timerBarContainer || !timerBar || !optionsContainer || !restartButton) {
        console.error("Rapid fire elements not found!");
        return;
    }

    const rapidFireQuestions = questions.rapidfire || [];

    // --- End of Game Condition ---
    if (rapidFireIndex >= rapidFireQuestions.length) {
        questionElement.textContent = "🏁 Finished!";
        optionsContainer.classList.add('hidden');
        timerBarContainer.classList.add('hidden'); // Hide timer bar
        restartButton.classList.remove('hidden');
        return;
    }

    // --- Display New Question ---
    const currentQuestion = rapidFireQuestions[rapidFireIndex];
    questionElement.textContent = currentQuestion.q;
    option1Button.textContent = currentQuestion.options[0];
    option2Button.textContent = currentQuestion.options[1];

    optionsContainer.classList.remove('hidden');
    restartButton.classList.add('hidden');
    timerBarContainer.classList.remove('hidden'); // Show timer bar container

    // --- Reset and Start Timer Bar Animation ---
    // 1. Remove transition class, reset width instantly
    timerBar.classList.remove('active-timer');
    timerBar.style.width = '100%';

    // 2. Force a reflow (important for the reset to register before transition starts)
    void timerBar.offsetWidth; // Reading offsetWidth forces reflow

    // 3. Add transition class back and set target width to 0
    timerBar.classList.add('active-timer');
    timerBar.style.width = '0%';

    // --- Set Timeout for Auto-Advance ---
    rapidFireTimeoutId = setTimeout(() => {
        console.log("Timer bar finished (timeout)");
        rapidFireTimeoutId = null; // Clear the id
        displayNextRapidFireQuestion(); // Move to next question
    }, RAPID_FIRE_TIME_LIMIT * 1000); // Wait 5 seconds

    rapidFireIndex++;
}

function startRapidFire() {
     rapidFireIndex = 0;
     // Clear any lingering timeout from previous games
     if (rapidFireTimeoutId) {
        clearTimeout(rapidFireTimeoutId);
        rapidFireTimeoutId = null;
     }

     const questionElement = document.getElementById('rapid-fire-question');
     const optionsContainer = document.querySelector('.rapid-fire-options');
     const restartButton = document.getElementById('restart-rapid-fire');
     const timerBarContainer = document.querySelector('.timer-bar-container');
     const timerBar = document.querySelector('.timer-bar'); // Get bar for reset

     if(questionElement) questionElement.textContent = "Get Ready...";
     if(optionsContainer) optionsContainer.classList.add('hidden');
     if(restartButton) restartButton.classList.add('hidden');
     if(timerBarContainer) timerBarContainer.classList.add('hidden'); // Hide container initially
     // Reset bar state visually
     if(timerBar) {
        timerBar.classList.remove('active-timer');
        timerBar.style.width = '100%';
     }


     // Display the first question after a short delay
     setTimeout(displayNextRapidFireQuestion, 1500);
}

// Event listeners for Rapid Fire page
if (window.location.pathname.includes('rapid-fire.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const option1Button = document.getElementById('rapid-fire-option1');
        const option2Button = document.getElementById('rapid-fire-option2');
        const restartButton = document.getElementById('restart-rapid-fire');

        // Handle option clicks
        const handleOptionClick = () => {
            console.log("Option clicked!");
            // Clear the auto-advance timeout if the user clicks
             if (rapidFireTimeoutId) {
                clearTimeout(rapidFireTimeoutId);
                rapidFireTimeoutId = null;
             }
            displayNextRapidFireQuestion(); // Move to next question immediately
        };

        if (option1Button) {
            option1Button.addEventListener('click', handleOptionClick);
        }
        if (option2Button) {
            option2Button.addEventListener('click', handleOptionClick);
        }

        // Handle restart click
         if (restartButton) {
            restartButton.addEventListener('click', startRapidFire);
        }

        startRapidFire(); // Start the sequence on page load
    });
}
// --- End Rapid Fire Logic ---


// My Answers Page Functionality
if (window.location.pathname.includes('my-answers.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const answersGrid = document.querySelector('.answers-grid');
        const clearHistoryButton = document.querySelector('.clear-history-button');

        function displayAnswers() {
            const answers = getAnswers();
            answersGrid.innerHTML = '';

            if (answers.length === 0) {
                answersGrid.innerHTML = '<p class="no-answers">No answers saved yet. Start answering questions!</p>';
                if(clearHistoryButton) clearHistoryButton.style.display = 'none';
            } else {
                 if(clearHistoryButton) clearHistoryButton.style.display = 'block';
                answers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                answersGrid.innerHTML = answers.map(answer => `
                    <div class="answer-card">
                        <h2>${answer.question}</h2>
                        <p class="meta">Category: ${answer.category} • ${new Date(answer.timestamp).toLocaleString()}</p>
                        <p>${answer.answer}</p>
                    </div>
                `).join('');
            }
        }

        displayAnswers();

        if (clearHistoryButton) {
            clearHistoryButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete all your saved answers? This cannot be undone.')) {
                    localStorage.removeItem('answers');
                    displayAnswers();
                }
            });
        }
    });
}

// Letter Page Functionality
if (window.location.pathname.includes('letter.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const letterTextarea = document.querySelector('textarea');
        const copyButton = document.querySelector('.copy-button');
        const downloadButton = document.querySelector('.download-button');
        const shareOptions = document.querySelectorAll('.share-option'); // Assuming share buttons exist

        if (copyButton) {
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(letterTextarea.value);
                copyButton.innerHTML = '<i data-feather="check"></i> Copied!'; // Use feather icon
                feather.replace(); // Re-render icons
                setTimeout(() => {
                    copyButton.innerHTML = '<i data-feather="copy"></i> Copy Text';
                    feather.replace();
                }, 2000);
            });
        }

        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                if (!letterTextarea.value.trim()) {
                    alert('Please write something before downloading.');
                    return;
                }
                const element = document.createElement('a');
                const file = new Blob([letterTextarea.value], { type: 'text/plain;charset=utf-8' }); // Ensure UTF-8
                element.href = URL.createObjectURL(file);
                element.download = 'letter-to-friend.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                URL.revokeObjectURL(element.href); // Clean up blob URL
            });
        }

        // Share functionality (Keep if share buttons are in HTML)
        if (shareOptions) {
            shareOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const text = letterTextarea.value;
                    if (!text) {
                        alert('Please write something before sharing!');
                        return;
                    }

                    const platform = option.classList[1];
                    let shareUrl = '';

                    switch (platform) {
                        case 'whatsapp':
                            shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                            break;
                        case 'twitter':
                            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                            break;
                        case 'instagram':
                            navigator.clipboard.writeText(text);
                            alert('Text copied to clipboard! Open Instagram and paste in your story or direct message.');
                            return;
                        case 'snapchat':
                            navigator.clipboard.writeText(text);
                            alert('Text copied to clipboard! Open Snapchat and paste in your snap or chat.');
                            return;
                    }

                    if (shareUrl) {
                        window.open(shareUrl, '_blank', 'noopener,noreferrer'); // Add security attributes
                    }
                });
            });
        }
    });
}

// --- Theme Toggle Logic ---
const themeToggleButton = document.getElementById('theme-toggle-button');
const currentTheme = localStorage.getItem('theme'); // Check local storage

// Function to set the theme (class and icon)
function setTheme(theme) {
    const body = document.body;
    const toggleIcon = themeToggleButton.querySelector('i'); // Get the icon element

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        toggleIcon.setAttribute('data-feather', 'sun'); // Show sun icon
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        toggleIcon.setAttribute('data-feather', 'moon'); // Show moon icon
        localStorage.setItem('theme', 'light');
    }
    feather.replace(); // IMPORTANT: Re-render icons after changing attribute
}

// Apply the saved theme on initial load
if (currentTheme) {
    setTheme(currentTheme);
} else {
    // Optional: Check system preference if no theme saved
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // setTheme(prefersDark ? 'dark' : 'light');
    setTheme('light'); // Default to light if nothing saved/checked
}


// Add event listener to the toggle button
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const body = document.body;
        // Check current state by looking for the class
        if (body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
}
// --- End Theme Toggle Logic ---


// IMPORTANT: Ensure Feather Icons are initialized at the end of each page's script execution
// Example for a specific page (needs to be adapted if using global listener)
/*
if (window.location.pathname.includes('some-page.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // ... other page logic ...
        feather.replace(); // Call feather replace *after* potentially changing icons
    });
}
*/
// If using global DOMContentLoaded listeners, ensure feather.replace() is called within them
// or after the theme is set initially. The setTheme function now calls it.