const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Triangle properties
const triangleSize = 50;
const rows = Math.ceil(window.innerHeight / triangleSize);
const cols = Math.ceil(window.innerWidth / triangleSize);

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Update mouse position
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Draw triangle pattern
function drawTriangles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * triangleSize;
            const y = row * triangleSize;

            // Calculate distance from mouse
            const dx = mouseX - (x + triangleSize / 2);
            const dy = mouseY - (y + triangleSize / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200; // Maximum distance for color change

            // Calculate color based on distance
            const intensity = Math.max(0, 1 - distance / maxDistance);
            const purple = Math.floor(intensity * 255);

            // Draw triangles
            ctx.beginPath();
            if (row % 2 === 0) {
                // Upward pointing triangle
                ctx.moveTo(x, y + triangleSize);
                ctx.lineTo(x + triangleSize / 2, y);
                ctx.lineTo(x + triangleSize, y + triangleSize);
            } else {
                // Downward pointing triangle
                ctx.moveTo(x, y);
                ctx.lineTo(x + triangleSize / 2, y + triangleSize);
                ctx.lineTo(x + triangleSize, y);
            }
            ctx.closePath();

            // Set fill color with transparency
            ctx.fillStyle = `rgba(${purple}, 0, ${purple}, ${intensity * 0.5})`;
            ctx.fill();
        }
    }

    requestAnimationFrame(drawTriangles);
}

// Start animation
drawTriangles();

// Game Details Placcard Animation
document.addEventListener('DOMContentLoaded', () => {
    const placcards = document.querySelectorAll('.placcard');
    let currentPlaccard = 0;
    let isAnimating = false;
    let autoPlayInterval;

    // Initial setup of placcards
    function initPlaccards() {
        placcards.forEach((placcard, index) => {
            if (index === 0) {
                placcard.classList.add('active');
                placcard.style.transform = 'translateX(0)';
            } else {
                placcard.style.transform = 'translateX(100%)';
            }
        });
    }

    function nextPlaccard() {
        if (isAnimating) return;
        isAnimating = true;

        // Hide current placcard
        placcards[currentPlaccard].classList.remove('active');
        placcards[currentPlaccard].style.transform = 'translateX(-100%)';

        // Update current placcard index
        currentPlaccard = (currentPlaccard + 1) % placcards.length;

        // Show next placcard
        placcards[currentPlaccard].style.transform = 'translateX(0)';
        placcards[currentPlaccard].classList.add('active');

        // Prepare the next placcard in sequence
        const nextIndex = (currentPlaccard + 1) % placcards.length;
        placcards[nextIndex].style.transform = 'translateX(100%)';

        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Initialize and start autoplay
    initPlaccards();
    autoPlayInterval = setInterval(nextPlaccard, 2000); // Change every 2 seconds

    // Optional: Reset the interval when the tab becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoPlayInterval);
        } else {
            autoPlayInterval = setInterval(nextPlaccard, 2000);
        }
    });
});

// Menu Overlay Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button');
    const menuClose = document.querySelector('.menu-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuBtns = document.querySelectorAll('.menu-btn');

    // Open menu
    menuButton.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    // Close menu
    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close menu when clicking outside
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle menu button clicks
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const buttonText = btn.textContent.trim();
            if (buttonText === 'Play Hangman') {
                window.location.href = 'hangman.html';
            } else if (buttonText === 'Play Scrabble') {
                window.location.href = 'scrabble.html';
            } else if (buttonText === 'Play Wordsearch') {
                window.location.href = 'wordsearch.html';
            } else if (buttonText === 'Play Boggle') {
                window.location.href = 'boggle.html';
            } else if (buttonText === 'Leaderboard') {
                window.location.href = 'leaderboard.html';
            }
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 