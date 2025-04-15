// Game categories with words
const categories = {
    fruits: ['APPLE', 'MANGO', 'GRAPE', 'PEACH', 'LEMON'],
    vegetables: ['CARROT', 'POTATO', 'ONION', 'GARLIC', 'TOMATO'],
    computer: ['MOUSE', 'SCREEN', 'LAPTOP', 'KEYBOARD', 'PRINTER'],
    music: ['PIANO', 'GUITAR', 'DRUMS', 'VIOLIN', 'FLUTE'],
    countries: ['INDIA', 'JAPAN', 'SPAIN', 'FRANCE', 'BRAZIL'],
    animals: ['TIGER', 'ZEBRA', 'PANDA', 'KOALA', 'EAGLE']
};

// Game state variables
let currentCategory = '';
let foundWords = new Set();
let selectedCells = [];
let isSelecting = false;
let gameTimer;
let seconds = 0;
let isPaused = false;

// Sound effects
const CORRECT_SOUND_PATH = 'correct.mp3';
const ERROR_SOUND_PATH = 'error.mp3';

// Play sound function
function playSound(soundPath) {
    const sound = new Audio(soundPath);
    sound.play().catch(error => console.error('Error playing sound:', error));
}

// Screen navigation functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Initialize event listeners
document.querySelector('.play-button').addEventListener('click', () => {
    showScreen('categoryScreen');
});

// Category selection
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.dataset.category;
        showScreen('rulesScreen');
    });
});

// Start game
document.querySelector('.start-button').addEventListener('click', () => {
    showScreen('gameScreen');
    initializeGame();
});

// Initialize game
function initializeGame() {
    const words = categories[currentCategory];
    const grid = generateWordSearchGrid(words);
    displayGrid(grid);
    displayWordList(words);
    startTimer();
    foundWords.clear();
}

// Generate word search grid
function generateWordSearchGrid(words) {
    const gridSize = 10;
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const directions = [
        [0, 1],  // right
        [1, 0],  // down
        [1, 1]   // diagonal
    ];

    // Place words in grid
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [dx, dy] = direction;
            
            // Calculate maximum starting position based on word length and direction
            const maxX = gridSize - (dx * word.length);
            const maxY = gridSize - (dy * word.length);
            
            const startX = Math.floor(Math.random() * maxX);
            const startY = Math.floor(Math.random() * maxY);
            
            // Check if word can be placed
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const x = startX + (dx * i);
                const y = startY + (dy * i);
                if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            
            if (canPlace) {
                // Place the word
                for (let i = 0; i < word.length; i++) {
                    const x = startX + (dx * i);
                    const y = startY + (dy * i);
                    grid[y][x] = word[i];
                }
                placed = true;
            }
        }
    });

    // Fill empty spaces with random letters
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    return grid;
}

// Display grid
function displayGrid(grid) {
    const letterGrid = document.querySelector('.letter-grid');
    letterGrid.innerHTML = '';
    
    grid.forEach((row, y) => {
        row.forEach((letter, x) => {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = letter;
            cell.dataset.x = x;
            cell.dataset.y = y;
            letterGrid.appendChild(cell);
        });
    });
}

// Display word list
function displayWordList(words) {
    const wordList = document.querySelector('.word-list');
    wordList.innerHTML = '';
    
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordList.appendChild(wordElement);
    });
}

// Timer functions
function startTimer() {
    seconds = 0;
    updateTimerDisplay();
    gameTimer = setInterval(() => {
        if (!isPaused) {
            seconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    document.querySelector('.timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Word selection
document.querySelector('.letter-grid').addEventListener('mousedown', startSelection);
document.querySelector('.letter-grid').addEventListener('mouseover', continueSelection);
document.addEventListener('mouseup', endSelection);

function startSelection(e) {
    if (!e.target.classList.contains('letter-cell') || isPaused) return;
    isSelecting = true;
    selectedCells = [e.target];
    e.target.classList.add('selected');
    updateSelectionLine();
}

function continueSelection(e) {
    if (!isSelecting || !e.target.classList.contains('letter-cell') || isPaused) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    const newCell = e.target;
    
    if (isValidSelection(lastCell, newCell) && !selectedCells.includes(newCell)) {
        selectedCells.push(newCell);
        newCell.classList.add('selected');
        updateSelectionLine();
    }
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    const word = selectedCells.map(cell => cell.textContent).join('');
    checkWord(word);
    
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
    updateSelectionLine();
}

function isValidSelection(cell1, cell2) {
    const x1 = parseInt(cell1.dataset.x);
    const y1 = parseInt(cell1.dataset.y);
    const x2 = parseInt(cell2.dataset.x);
    const y2 = parseInt(cell2.dataset.y);
    
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    
    return (dx === 1 && dy === 0) || // horizontal
           (dx === 0 && dy === 1) || // vertical
           (dx === 1 && dy === 1);   // diagonal
}

function updateSelectionLine() {
    const canvas = document.getElementById('selectionCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    if (selectedCells.length < 2) return;
    
    ctx.strokeStyle = '#ff7b00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    selectedCells.forEach((cell, index) => {
        const cellRect = cell.getBoundingClientRect();
        const x = cellRect.left - rect.left + cellRect.width / 2;
        const y = cellRect.top - rect.top + cellRect.height / 2;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

function checkWord(word) {
    if (categories[currentCategory].includes(word) && !foundWords.has(word)) {
        foundWords.add(word);
        playSound(CORRECT_SOUND_PATH);
        updateWordList();
        
        if (foundWords.size === categories[currentCategory].length) {
            showSuccessModal();
        }
    } else {
        playSound(ERROR_SOUND_PATH);
    }
}

function updateWordList() {
    document.querySelectorAll('.word-item').forEach(wordElement => {
        if (foundWords.has(wordElement.textContent)) {
            wordElement.classList.add('found');
        }
    });
}

// Control buttons
document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = true;
    document.getElementById('pauseModal').classList.remove('hidden');
});

document.getElementById('resumeButton').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pauseModal').classList.add('hidden');
});

document.getElementById('exitButton').addEventListener('click', () => {
    document.getElementById('exitModal').classList.remove('hidden');
});

document.getElementById('confirmExit').addEventListener('click', () => {
    clearInterval(gameTimer);
    showScreen('categoryScreen');
    document.getElementById('exitModal').classList.add('hidden');
});

document.getElementById('cancelExit').addEventListener('click', () => {
    document.getElementById('exitModal').classList.add('hidden');
});

// Success modal
function showSuccessModal() {
    clearInterval(gameTimer);
    document.getElementById('successModal').classList.remove('hidden');
}

document.getElementById('playAgainButton').addEventListener('click', () => {
    document.getElementById('successModal').classList.add('hidden');
    showScreen('categoryScreen');
}); 