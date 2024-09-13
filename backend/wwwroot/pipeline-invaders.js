"use strict";
// Pipeline Invaders Game Logic in TypeScript
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let serverHealth = 100;
let isGameOver = false;
let fireRate = 500; // Milliseconds between shots
let lastShot = 0;
let enemySpeed = 1;
let powerUpActive = false;
let powerUpDuration = 5000; // 5 seconds
let powerUpEndTime = 0;
let playerName = localStorage.getItem('playerName') || null; // Retrieve player name from localStorage if it exists
// Player settings
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: "#0f0", // Green color for the player
    speed: 7,
    img: new Image()
};
// Load the player SVG
player.img.src = "img/player.svg";
// Bullets
const bullets = [];
// Enemies (Bugs, Vulnerabilities, Misconfigurations)
const enemies = [];
// Power-ups
const powerUps = [];
// Key press event listeners
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);
// Ensure images for enemies and power-ups are fully loaded before using them
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}
// Images for enemies and power-ups
const enemyImages = {
    bug: loadImage("img/bug.svg"),
    vulnerability: loadImage("img/vulnerability.svg"),
    misconfiguration: loadImage("img/misconfiguration.svg")
};
const powerUpImages = {
    githubActions: loadImage("img/githubactions.svg"),
    githubCopilot: loadImage("img/githubcopilot.svg"),
    githubAdvancedSecurity: loadImage("img/githubadvancedsecurity.svg"),
    kubernetes: loadImage("img/kubernetes.svg")
};
// Power-up effects
const powerUpEffects = {
    "githubActions": () => {
        fireRate = 200; // Faster fire rate
        displayMessage("GitHub Actions: Increased fire rate!");
    },
    "githubCopilot": () => {
        autoShoot(); // Automatically fire for 5 seconds
        displayMessage("GitHub Copilot: Auto-shoot activated!");
    },
    "githubAdvancedSecurity": () => {
        serverHealth = Math.min(100, serverHealth + 30); // Heal server
        displayMessage("GitHub Advanced Security: Server health restored!");
    },
    "kubernetes": () => {
        player.speed = 15; // Increase player speed
        displayMessage("Kubernetes: Speed boost activated!");
    }
};
// Main game loop
function gameLoop(timestamp) {
    if (isGameOver)
        return;
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw player with tinting
    drawTintedImage(player.img, player.x, player.y, player.width, player.height, player.color);
    // Move player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    // Fire bullets
    if (keys[' ']) {
        shoot(timestamp);
    }
    // Update bullets
    updateBullets();
    // Update enemies
    updateEnemies();
    // Update power-ups
    updatePowerUps(); // Ensure power-ups are updated and drawn
    // Check for power-up expiry
    if (powerUpActive && timestamp > powerUpEndTime) {
        resetPowerUp();
    }
    // Draw score and health
    updateScoreboard();
    // Request the next frame
    requestAnimationFrame(gameLoop);
}
// Function to draw images with a tint (used for player, enemies, power-ups)
function drawTintedImage(img, x, y, width, height, color) {
    // Draw the original image
    ctx.drawImage(img, x, y, width, height);
    // Apply a tint using a colored rectangle over the image with global composite operation
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';
}
// Shooting function
function shoot(timestamp) {
    if (timestamp - lastShot > fireRate) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y - 10, width: 5, height: 10 });
        lastShot = timestamp;
    }
}
// Update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
        else {
            ctx.fillStyle = "#fff";
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });
}
// Generate random enemies
function generateEnemies() {
    if (Math.random() < 0.02) {
        const enemyTypes = ["bug", "vulnerability", "misconfiguration"];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: 0,
            width: 40,
            height: 40,
            type: randomType
        });
    }
}
// Update enemies
function updateEnemies() {
    generateEnemies();
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            serverHealth -= 10;
            if (serverHealth <= 0) {
                gameOver();
            }
        }
        else {
            // Draw the enemy image based on type with tinting
            const img = enemyImages[enemy.type];
            const color = "#f00"; // Red tint for enemies
            if (img && img.complete) {
                drawTintedImage(img, enemy.x, enemy.y, enemy.width, enemy.height, color);
            }
        }
        // Check collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                dropPowerUp(enemy.x, enemy.y); // Chance of dropping power-up after enemy is destroyed
            }
        });
    });
}
// Check for collisions
function checkCollision(bullet, enemy) {
    return bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y;
}
// Drop power-ups randomly when an enemy is destroyed
function dropPowerUp(x, y) {
    if (Math.random() < 0.2) { // 20% chance to drop a power-up
        const powerUpTypes = ["githubActions", "githubCopilot", "githubAdvancedSecurity", "kubernetes"];
        const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        powerUps.push({ x, y, width: 30, height: 30, type: randomPowerUp });
        // Log when a power-up is dropped for debugging
        console.log(`Power-up dropped at (${x}, ${y}) of type ${randomPowerUp}`);
    }
}
// Update power-ups
function updatePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += 2;
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
        else {
            // Log position of power-up to debug rendering
            console.log(`Drawing power-up of type ${powerUp.type} at (${powerUp.x}, ${powerUp.y})`);
            // Draw the power-up image based on type with blue tint
            const img = powerUpImages[powerUp.type];
            const color = "#00f"; // Blue tint for power-ups
            if (img && img.complete) {
                drawTintedImage(img, powerUp.x, powerUp.y, powerUp.width, powerUp.height, color);
            }
        }
        // Check collision with player
        if (checkCollision(player, powerUp)) {
            activatePowerUp(powerUp.type);
            powerUps.splice(index, 1); // Remove power-up after it's collected
        }
    });
}
// Activate power-up
function activatePowerUp(type) {
    powerUpActive = true;
    powerUpEndTime = Date.now() + powerUpDuration;
    // Cast the type as a valid power-up key
    powerUpEffects[type]();
}
// Reset power-up effects
function resetPowerUp() {
    powerUpActive = false;
    fireRate = 500;
    player.speed = 7;
}
// Auto-shoot (GitHub Copilot)
function autoShoot() {
    const autoFireInterval = setInterval(() => {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y - 10, width: 5, height: 10 });
    }, fireRate);
    setTimeout(() => clearInterval(autoFireInterval), powerUpDuration);
}
// Display power-up messages
function displayMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.position = 'absolute';
    msgDiv.style.top = '10px';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translateX(-50%)';
    msgDiv.style.fontSize = '20px';
    msgDiv.style.color = '#fff';
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2000);
}
// Update scoreboard
function updateScoreboard() {
    document.getElementById('score').textContent = score.toString();
    document.getElementById('serverHealth').textContent = serverHealth.toString();
}
// Game over function
function gameOver() {
    isGameOver = true;
    promptPlayerName(); // Request player name if not provided yet
    postHighScore(playerName, score); // Post the score to the API
    fetchHighScores(); // Fetch high scores to display
    showHighscoreDialog(); // Show the highscore dialog after fetching the scores
    showRestartButton();
}
// Prompt the user for their name if not already entered
function promptPlayerName() {
    if (!playerName) {
        playerName = prompt('Enter your name for the highscore:');
        if (playerName) {
            localStorage.setItem('playerName', playerName); // Save player name in localStorage
        }
        else {
            playerName = 'Anonymous'; // Default name if user skips entering a name
        }
    }
}
// Post the player's high score to the API
function postHighScore(playerName, score) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { playerName, score };
        try {
            yield fetch('/api/highscore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        catch (error) {
            console.error('Error posting high score:', error);
        }
    });
}
// Fetch high scores from the API and display in dialog
function fetchHighScores() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/highscore');
            const highScores = yield response.json();
            const highscoreList = document.getElementById('highscoreList');
            highscoreList.innerHTML = ''; // Clear previous entries
            // Populate the high scores into the list
            highScores.forEach((score) => {
                const li = document.createElement('li');
                li.textContent = `${score.playerName}: ${score.score}`;
                highscoreList.appendChild(li);
            });
        }
        catch (error) {
            console.error('Error fetching high scores:', error);
        }
    });
}
// Event listener for "View Highscores" link
(_a = document.getElementById('viewHighscores')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
    e.preventDefault();
    openHighscoreDialog();
});
// Function to open the highscore dialog
function openHighscoreDialog() {
    fetchHighScores(); // Fetch and display the top 10 scores
    document.getElementById('highscoreDialog').style.display = 'block';
}
// Function to show the highscore dialog after game over
function showHighscoreDialog() {
    const highscoreDialog = document.getElementById('highscoreDialog');
    if (highscoreDialog) {
        highscoreDialog.style.display = 'block';
    }
}
// Function to close the highscore dialog
function closeHighscoreDialog() {
    const highscoreDialog = document.getElementById('highscoreDialog');
    if (highscoreDialog) {
        highscoreDialog.style.display = 'none';
    }
}
// Extend showRestartButton to display the high scores above the button
function showRestartButton() {
    fetchHighScores(); // Fetch the latest high scores
    if (!restartButton) {
        restartButton = document.createElement('button');
        restartButton.textContent = "Restart Game";
        restartButton.style.position = 'absolute';
        restartButton.style.top = '60%';
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translate(-50%, -50%)';
        restartButton.style.fontSize = '24px';
        restartButton.style.padding = '10px 20px';
        document.body.appendChild(restartButton);
    }
    restartButton.style.display = 'block';
    restartButton.addEventListener('click', resetGame);
}
// Reset game logic
function resetGame() {
    score = 0;
    serverHealth = 100;
    isGameOver = false;
    bullets.length = 0; // Clear all bullets
    enemies.length = 0; // Clear all enemies
    powerUps.length = 0; // Clear all power-ups
    player.x = canvas.width / 2 - 25; // Reset player position
    fireRate = 500; // Reset fire rate
    player.speed = 7; // Reset player speed
    hideRestartButton(); // Hide restart button
    closeHighscoreDialog(); // Close the highscore dialog when restarting the game
    gameLoop(0); // Restart the game loop
}
// Add a global restart button
let restartButton = null;
function hideRestartButton() {
    if (restartButton) {
        restartButton.style.display = 'none';
        restartButton.removeEventListener('click', resetGame);
    }
}
// Start the game loop
requestAnimationFrame(gameLoop);
