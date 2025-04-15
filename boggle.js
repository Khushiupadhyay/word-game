// Game levels
const levels = [
    {
        grid: [
            ['D', 'P', 'G', 'M'],
            ['O', 'E', 'C', 'L'],
            ['G', 'N', 'A', 'K'],
            ['S', 'R', 'T', 'B']
        ],
        words: ['DOG', 'CAT', 'PEN'] // Words can be formed by connecting adjacent letters
    },
    {
        grid: [
            ['P', 'W', 'S', 'B'],
            ['S', 'I', 'T', 'D'],
            ['P', 'N', 'U', 'M'],
            ['Y', 'R', 'U', 'K']
        ],
        words: ['WIN', 'RUN', 'SPY'] // Words can be formed by connecting adjacent letters
    }
];

let currentLevel = 0;
let foundWords = new Set();
let selectedCells = [];
let points = 0;
const CORRECT_SOUND_PATH = 'correct.mp3';
const ERROR_SOUND_PATH = 'error.mp3';

// Function to play sound
function playSound(soundPath) {
    const sound = new Audio(soundPath);
    sound.play().catch(error => console.error('Error playing sound:', error));
}

// Initialize the game grid
function initializeGrid() {
    const grid = document.querySelector('.letter-grid');
    grid.innerHTML = '';
    const currentGrid = levels[currentLevel].grid;

    for (let row = 0; row < currentGrid.length; row++) {
        for (let col = 0; col < currentGrid[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = currentGrid[row][col];
            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseover', continueSelection);
            grid.appendChild(cell);
        }
    }

    // Reset game state
    foundWords.clear();
    document.querySelector('.found-words-list').innerHTML = '';
    document.querySelector('.category-text').textContent = `Question ${currentLevel + 1}) Find all possible words!`;
    points = 0;
    updatePoints();
}

// Handle mouse events for word selection
let isSelecting = false;

function startSelection(e) {
    if (e.button !== 0) return; // Only left click
    e.preventDefault(); // Prevent default selection behavior
    isSelecting = true;
    clearSelection();
    const cell = e.target;
    selectCell(cell);
    updateCanvas();
}

function continueSelection(e) {
    if (!isSelecting) return;
    e.preventDefault(); // Prevent default selection behavior
    const cell = e.target;
    if (cell.classList.contains('letter-cell') && !cell.classList.contains('selected')) {
        if (isAdjacent(cell)) {
            selectCell(cell);
            updateCanvas();
        }
    }
}

document.addEventListener('mouseup', (e) => {
    e.preventDefault(); // Prevent default selection behavior
    isSelecting = false;
    checkWord();
});

// Check if a cell is adjacent to the last selected cell
function isAdjacent(cell) {
    if (selectedCells.length === 0) return true;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    const newRow = parseInt(cell.dataset.row);
    const newCol = parseInt(cell.dataset.col);
    const lastRow = parseInt(lastCell.dataset.row);
    const lastCol = parseInt(lastCell.dataset.col);
    
    const rowDiff = Math.abs(newRow - lastRow);
    const colDiff = Math.abs(newCol - lastCol);
    
    // Only allow selection of directly adjacent cells (including diagonals)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
}

// Select a cell
function selectCell(cell) {
    cell.classList.add('selected');
    selectedCells.push(cell);
    document.querySelector('.submit-word').disabled = false;
}

// Clear selection
function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
    document.querySelector('.submit-word').disabled = true;
    updateCanvas();
}

// Update canvas with lines connecting selected cells
function updateCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size to match display size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    if (selectedCells.length < 2) return;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
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

// Check if the selected word is valid
function checkWord() {
    if (selectedCells.length < 2) return;
    
    const word = selectedCells.map(cell => cell.textContent).join('');
    if (levels[currentLevel].words.includes(word) && !foundWords.has(word)) {
        foundWords.add(word);
        playSound(CORRECT_SOUND_PATH);
        addFoundWord(word);
        points += word.length;
        updatePoints();
        
        // Check if all words are found
        if (foundWords.size === levels[currentLevel].words.length) {
            showSuccessModal();
        }
    } else {
        playSound(ERROR_SOUND_PATH);
    }
    
    clearSelection();
}

// Add found word to the list
function addFoundWord(word) {
    const foundWordsList = document.querySelector('.found-words-list');
    const wordElement = document.createElement('div');
    wordElement.className = 'found-word';
    wordElement.textContent = word;
    foundWordsList.appendChild(wordElement);
}

// Update points display
function updatePoints() {
    document.getElementById('pointsValue').textContent = points;
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

// Event Listeners
document.querySelector('.clear-selection').addEventListener('click', clearSelection);
document.querySelector('.submit-word').addEventListener('click', checkWord);

document.querySelector('.modal-button').addEventListener('click', () => {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    if (currentLevel < levels.length - 1) {
        currentLevel++;
    } else {
        currentLevel = 0;
    }
    initializeGrid();
});

// Handle window resize
window.addEventListener('resize', () => {
    updateCanvas();
});

// Initialize game
initializeGrid(); 