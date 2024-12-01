// Pipeline Invaders Game Logic in TypeScript

// Game settings
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
export let score = 0;
export let serverHealth = 100;
export let isGameOver = false;
export let fireRate = 500; // Milliseconds between shots
let lastShot = 0;
let enemySpeed = 1;
let powerUpActive = false;
let powerUpDuration = 5000; // 5 seconds
let powerUpEndTime = 0;
export let playerName = localStorage.getItem('playerName') || null; // Retrieve player name from localStorage if it exists

// Setter functions for testing
export function setScore(value: number) {
    score = value;
}

export function setServerHealth(value: number) {
    serverHealth = value;
}

export function setIsGameOver(value: boolean) {
    isGameOver = value;
}

export function setFireRate(value: number) {
    fireRate = value;
}

// **Added setPlayerName function**
export function setPlayerName(value: string | null) {
    playerName = value;
}

// Player settings
export const player = {
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
export const bullets: { x: number, y: number, width: number, height: number }[] = [];

// Enemies (Bugs, Vulnerabilities, Misconfigurations)
export const enemies: { x: number, y: number, width: number, height: number, type: string }[] = [];

// Power-ups
export const powerUps: { x: number, y: number, width: number, height: number, type: string }[] = [];

// Key press event listeners
const keys: { [key: string]: boolean } = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Ensure images for enemies and power-ups are fully loaded before using them
function loadImage(src: string): HTMLImageElement {
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
export function gameLoop(timestamp: number) {
    if (isGameOver) return;

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
function drawTintedImage(img: HTMLImageElement, x: number, y: number, width: number, height: number, color: string) {
    ctx.drawImage(img, x, y, width, height);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';
}

// Shooting function
export function shoot(timestamp: number) {
    if (timestamp - lastShot > fireRate) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y - 10, width: 5, height: 10 });
        lastShot = timestamp;
    }
}

// Update bullets
export function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        } else {
            ctx.fillStyle = "#fff";
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });
}

// Generate random enemies
export function generateEnemies() {
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
export function updateEnemies() {
    generateEnemies();
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            serverHealth -= 10;
            if (serverHealth <= 0) {
                gameOver();
            }
        } else {
            const img = enemyImages[enemy.type as keyof typeof enemyImages];
            const color = "#f00"; // Red tint for enemies
            if (img && img.complete) {
                drawTintedImage(img, enemy.x, enemy.y, enemy.width, enemy.height, color);
            }
        }
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                dropPowerUp(enemy.x, enemy.y);
            }
        });
    });
}

// Check for collisions
export function checkCollision(bullet: any, enemy: any): boolean {
    return bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y;
}

// Drop power-ups randomly when an enemy is destroyed
export function dropPowerUp(x: number, y: number) {
    if (Math.random() < 0.2) {
        const powerUpTypes = ["githubActions", "githubCopilot", "githubAdvancedSecurity", "kubernetes"];
        const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        powerUps.push({ x, y, width: 30, height: 30, type: randomPowerUp });
    }
}

// Update power-ups
export function updatePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += 2;
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        } else {
            const img = powerUpImages[powerUp.type as keyof typeof powerUpImages];
            const color = "#00f"; // Blue tint for power-ups
            if (img && img.complete) {
                drawTintedImage(img, powerUp.x, powerUp.y, powerUp.width, powerUp.height, color);
            }
        }
        if (checkCollision(player, powerUp)) {
            activatePowerUp(powerUp.type);
            powerUps.splice(index, 1);
        }
    });
}

// Activate power-up
export function activatePowerUp(type: string) {
    powerUpActive = true;
    powerUpEndTime = Date.now() + powerUpDuration;
    eval(`(${(powerUpEffects as Record<string, () => void>)[type]})()`);
}

// Reset power-up effects
export function resetPowerUp() {
    powerUpActive = false;
    fireRate = 500;
    player.speed = 7;
}

// Auto-shoot (GitHub Copilot)
export function autoShoot() {
    const autoFireInterval = setInterval(() => {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y - 10, width: 5, height: 10 });
    }, fireRate);
    setTimeout(() => clearInterval(autoFireInterval), powerUpDuration);
}

// Display power-up messages
export function displayMessage(message: string) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = message; // Potential XSS if `message` contains malicious code
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
export function updateScoreboard() {
    document.getElementById('score')!.textContent = score.toString();
    document.getElementById('serverHealth')!.textContent = serverHealth.toString();
}

// Game over function
export function gameOver() {
    isGameOver = true;
    promptPlayerName();
    postHighScore(playerName!, score);
    fetchHighScores();
    showHighscoreDialog();
    showRestartButton();
}

// Prompt the user for their name if not already entered
export function promptPlayerName() {
    if (!playerName) {
        playerName = prompt('Enter your name for the highscore:');
        if (playerName) {
            localStorage.setItem('playerName', playerName);
        } else {
            playerName = 'Anonymous';
        }
    }
}

// Post the player's high score to the API
export async function postHighScore(playerName: string, score: number) {
    const data = { playerName, score };
    try {
        await fetch('/api/highscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error posting high score:', error);
    }
}

// Fetch high scores from the API and display in dialog
export async function fetchHighScores() {
    try {
        const response = await fetch('/api/highscore');
        const highScores = await response.json();
        const highscoreList = document.getElementById('highscoreList')!;
        highscoreList.innerHTML = '';
        highScores.forEach((score: { playerName: string, score: number }) => {
            const li = document.createElement('li');
            li.textContent = `${score.playerName}: ${score.score}`;
            highscoreList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
}

// Event listener for "View Highscores" link
document.getElementById('viewHighscores')?.addEventListener('click', (e) => {
    e.preventDefault();
    openHighscoreDialog();
});

// Function to open the highscore dialog
export function openHighscoreDialog() {
    fetchHighScores();
    document.getElementById('highscoreDialog')!.style.display = 'block';
}

// Function to show the highscore dialog after game over
export function showHighscoreDialog() {
    const highscoreDialog = document.getElementById('highscoreDialog');
    if (highscoreDialog) {
        highscoreDialog.style.display = 'block';
    }
}

// Function to close the highscore dialog
export function closeHighscoreDialog() {
    const highscoreDialog = document.getElementById('highscoreDialog');
    if (highscoreDialog) {
        highscoreDialog.style.display = 'none';
    }
}

// Extend showRestartButton to display the high scores above the button
export function showRestartButton() {
    fetchHighScores();
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.style.display = 'block';
    }
}

// Reset game logic
export function resetGame() {
    score = 0;
    serverHealth = 100;
    isGameOver = false;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;
    player.x = canvas.width / 2 - 25;
    fireRate = 500;
    player.speed = 7;
    hideRestartButton();
    closeHighscoreDialog();
    gameLoop(0);
}

// Hide restart button
export function hideRestartButton() {
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.style.display = 'none';
    }
}

// Event listener for "View Highscores" link
document.getElementById('viewHighscores')?.addEventListener('click', (e) => {
    e.preventDefault();
    openHighscoreDialog();
});

// Add event listeners to buttons
document.getElementById('restartButton')?.addEventListener('click', resetGame);
document.getElementById('closeHighscoreDialogButton')?.addEventListener('click', closeHighscoreDialog);

// Start the game loop
requestAnimationFrame(gameLoop);
