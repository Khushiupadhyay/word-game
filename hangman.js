const words = [
    { question: "Question 1) Insect", word: "ANT" },
    { question: "Question 2) A fruit", word: "APPLE" }
];

let currentQuestionIndex = 0;
let currentWord = words[currentQuestionIndex].word;
let guessedLetters = new Set();
let remainingGuesses = 6;
let gameWon = false;

const categoryText = document.querySelector('.category-text');
const letterSpaces = document.querySelector('.letter-spaces');
const modal = document.getElementById('gameOverModal');
const modalTitle = document.querySelector('.modal-title');
const modalButton = document.querySelector('.modal-button');
const nextButton = document.createElement('button');
nextButton.className = 'modal-button next-button';
nextButton.textContent = 'Next Question';

// Sound paths
const CORRECT_SOUND_PATH = 'correct.mp3';
const ERROR_SOUND_PATH = 'error.mp3';

// Function to play sound
function playSound(soundPath) {
    const sound = new Audio(soundPath);
    sound.play().catch(error => console.error('Error playing sound:', error));
}

function initializeGame() {
    currentWord = words[currentQuestionIndex].word;
    categoryText.textContent = words[currentQuestionIndex].question;
    guessedLetters.clear();
    remainingGuesses = 6;
    gameWon = false;
    
    // Update letter spaces
    letterSpaces.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const space = document.createElement('span');
        space.className = 'letter-space';
        letterSpaces.appendChild(space);
    }
    
    // Reset keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'wrong');
        key.disabled = false;
    });
    
    // Reset canvas
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGallows();
}

function showGameOverModal(won) {
    modalTitle.textContent = won ? 'Congratulations!' : 'Game Over!';
    modal.style.display = 'flex';
    
    // Remove next button if it exists
    if (nextButton.parentNode) {
        nextButton.parentNode.removeChild(nextButton);
    }
    
    // Show next button only if won and there's a next question
    if (won && currentQuestionIndex < words.length - 1) {
        modalButton.textContent = 'Play Again';
        modalButton.parentNode.insertBefore(nextButton, modalButton.nextSibling);
    } else {
        modalButton.textContent = 'Play Again';
    }
}

// Event Listeners
modalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    initializeGame();
});

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    modal.style.display = 'none';
    initializeGame();
});

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        if (gameWon || remainingGuesses <= 0) return;
        
        const letter = key.textContent;
        if (!guessedLetters.has(letter)) {
            guessedLetters.add(letter);
            
            if (currentWord.includes(letter)) {
                playSound(CORRECT_SOUND_PATH);
                key.classList.add('correct');
                updateWordDisplay();
                
                // Check if word is complete
                const wordComplete = [...currentWord].every(l => guessedLetters.has(l));
                if (wordComplete) {
                    gameWon = true;
                    showGameOverModal(true);
                }
            } else {
                playSound(ERROR_SOUND_PATH);
                key.classList.add('wrong');
                remainingGuesses--;
                updateHangman();
                
                if (remainingGuesses <= 0) {
                    showGameOverModal(false);
                }
            }
        }
    });
});

function updateWordDisplay() {
    const spaces = document.querySelectorAll('.letter-space');
    [...currentWord].forEach((letter, index) => {
        if (guessedLetters.has(letter)) {
            spaces[index].classList.add('filled');
            spaces[index].setAttribute('data-letter', letter);
        }
    });
}

// Initialize game
initializeGame();

// Draw hangman stand
function drawStand() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    
    // Base
    ctx.beginPath();
    ctx.moveTo(50, 450);
    ctx.lineTo(350, 450);
    ctx.stroke();

    // Vertical pole
    ctx.beginPath();
    ctx.moveTo(100, 450);
    ctx.lineTo(100, 50);
    ctx.stroke();

    // Horizontal beam
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(300, 50);
    ctx.stroke();

    // Support beam
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(150, 50);
    ctx.stroke();

    // Rope
    ctx.beginPath();
    ctx.moveTo(300, 50);
    ctx.lineTo(300, 100);
    ctx.stroke();
}

// Draw hangman parts
const hangmanParts = [
    // Head
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(300, 140, 40, 0, Math.PI * 2);
        ctx.stroke();
    },
    // Body
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(300, 180);
        ctx.lineTo(300, 300);
        ctx.stroke();
    },
    // Left arm
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(300, 200);
        ctx.lineTo(220, 260);
        ctx.stroke();
    },
    // Right arm
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(300, 200);
        ctx.lineTo(380, 260);
        ctx.stroke();
    },
    // Left leg
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.lineTo(220, 380);
        ctx.stroke();
    },
    // Right leg
    () => {
        const canvas = document.getElementById('hangmanCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.lineTo(380, 380);
        ctx.stroke();
    }
];

function updateHangman() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStand();

    // Draw hangman parts based on number of wrong guesses (6 - remainingGuesses)
    for (let i = 0; i < (6 - remainingGuesses); i++) {
        hangmanParts[i]();
    }
}

function drawGallows() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStand();
} 