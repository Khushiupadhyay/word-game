// Game levels with their possible words
const levels = [
    {
        letters: [
            ['F', 'I', 'C', 'K'],
            ['R', 'O', 'S', 'H'],
            ['B', '_', 'O', 'E']
        ],
        words: ['ROCK', 'FISH']
    },
    {
        letters: [
            ['P', 'L', 'A', 'Y'],
            ['S', 'T', 'O', 'P'],
            ['W', 'I', 'N', 'E']
        ],
        words: ['PLAY', 'STOP', 'WINE']
    }
];

let currentLevel = 0;
let foundWords = new Set();
let selectedColumn = null;
const CORRECT_SOUND_PATH = 'correct.mp3';
const ERROR_SOUND_PATH = 'error.mp3';

// Function to play sound
function playSound(soundPath) {
    const sound = new Audio(soundPath);
    sound.play().catch(error => console.error('Error playing sound:', error));
}

// Initialize the game grid
function initializeGrid() {
    const grid = document.querySelector('.word-grid');
    grid.innerHTML = '';
    const currentLetters = levels[currentLevel].letters;

    // Create grid cells
    for (let row = 0; row < currentLetters.length; row++) {
        for (let col = 0; col < currentLetters[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = currentLetters[row][col];
            grid.appendChild(cell);

            // Add click event to select column
            cell.addEventListener('click', () => selectColumn(col));
        }
    }
}

// Select a column for movement
function selectColumn(col) {
    if (selectedColumn === col) {
        selectedColumn = null;
    } else {
        selectedColumn = col;
    }

    // Update visual selection
    document.querySelectorAll('.letter-cell').forEach(cell => {
        if (parseInt(cell.dataset.col) === selectedColumn) {
            cell.classList.add('selected');
        } else {
            cell.classList.remove('selected');
        }
    });
}

// Move selected column up or down
function moveColumn(direction) {
    if (selectedColumn === null) return;

    const currentLetters = levels[currentLevel].letters;
    if (direction === 'up') {
        // Move last letter to front
        const temp = currentLetters[currentLetters.length - 1][selectedColumn];
        for (let i = currentLetters.length - 1; i > 0; i--) {
            currentLetters[i][selectedColumn] = currentLetters[i - 1][selectedColumn];
        }
        currentLetters[0][selectedColumn] = temp;
    } else {
        // Move first letter to end
        const temp = currentLetters[0][selectedColumn];
        for (let i = 0; i < currentLetters.length - 1; i++) {
            currentLetters[i][selectedColumn] = currentLetters[i + 1][selectedColumn];
        }
        currentLetters[currentLetters.length - 1][selectedColumn] = temp;
    }

    updateGrid();
}

// Update grid display
function updateGrid() {
    const cells = document.querySelectorAll('.letter-cell');
    const currentLetters = levels[currentLevel].letters;
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.textContent = currentLetters[row][col];
    });
}

// Check if current word is valid
function checkWord() {
    const currentLetters = levels[currentLevel].letters;
    const word = currentLetters[0].join('');
    
    if (levels[currentLevel].words.includes(word) && !foundWords.has(word)) {
        foundWords.add(word);
        playSound(CORRECT_SOUND_PATH);
        addFoundWord(word);
        
        // Check if all words are found
        if (foundWords.size === levels[currentLevel].words.length) {
            showSuccessModal();
        }
    } else {
        playSound(ERROR_SOUND_PATH);
    }
}

// Add found word to the list
function addFoundWord(word) {
    const foundWordsList = document.querySelector('.found-words-list');
    const wordElement = document.createElement('div');
    wordElement.className = 'found-word';
    wordElement.textContent = word;
    foundWordsList.appendChild(wordElement);
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalButton = modal.querySelector('.modal-button');

    modalTitle.textContent = 'Level Complete!';
    modal.style.display = 'flex';

    if (currentLevel < levels.length - 1) {
        modalButton.textContent = 'Next Level';
    } else {
        modalButton.textContent = 'Play Again';
    }
}

// Initialize new level
function initializeLevel() {
    foundWords.clear();
    document.querySelector('.found-words-list').innerHTML = '';
    document.querySelector('.category-text').textContent = `Question ${currentLevel + 1}) Find all possible words!`;
    initializeGrid();
}

// Event Listeners
document.querySelector('.left-arrow').addEventListener('click', () => moveColumn('up'));
document.querySelector('.right-arrow').addEventListener('click', () => moveColumn('down'));
document.querySelector('.check-word').addEventListener('click', checkWord);

document.querySelector('.modal-button').addEventListener('click', () => {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        initializeLevel();
    } else {
        currentLevel = 0;
        initializeLevel();
    }
});

// Start game
initializeLevel(); 