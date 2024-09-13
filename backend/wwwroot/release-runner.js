"use strict";
// // Initialize the canvas
// const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d')!;
// // Game settings
// const gameWidth = canvas.width;
// const gameHeight = canvas.height;
// let score = 0;
// let isGameOver = false;
// let initialBugSpeed = 2;
// let bugSpeed = initialBugSpeed;  // Start with initial speed
// let releaseSpeed = initialBugSpeed;
// let speedIncrementInterval = 100; // Speed increases every 100 points
// let playerSpeed = 3;  // Reduced player speed
// // Player settings
// const player = {
//     width: 40,  // Adjusted for more manageable size
//     height: 40,
//     x: 50,
//     y: gameHeight - 70,
//     dx: 2,  // Added horizontal movement speed
//     dy: 0,
//     gravity: 0.4,  // Reduced gravity for easier jumping
//     jumpStrength: -13,  // Increased jump strength
//     isJumping: false,
//     color: '#0f0'
// };
// // Obstacles (bugs)
// let bugs: { x: number, y: number, width: number, height: number }[] = [];
// // Power-ups (releases)
// let releases: { x: number, y: number, width: number, height: number }[] = [];
// // Handle player movement
// function handlePlayerMovement() {
//     // Apply gravity
//     player.dy += player.gravity;
//     player.y += player.dy;
//     // Apply horizontal movement
//     if (player.isJumping) {
//         player.x += player.dx;
//     }
//     // Prevent player from falling through the floor
//     if (player.y + player.height > gameHeight) {
//         player.y = gameHeight - player.height;
//         player.dy = 0;
//         player.isJumping = false;
//     }
//     // Keep player within the bounds of the game area
//     if (player.x < 0) player.x = 0;
//     if (player.x + player.width > gameWidth) player.x = gameWidth - player.width;
// }
// // Handle player jump
// function jump() {
//     if (!player.isJumping) {
//         player.dy = player.jumpStrength;
//         player.isJumping = true;
//     }
// }
// // Generate obstacles (bugs)
// function createBugs() {
//     if (Math.random() < 0.01) {  // Reduced spawn rate for more spacing
//         bugs.push({
//             x: gameWidth,
//             y: gameHeight - 50,
//             width: 40,  // Adjusted for better fit
//             height: 40
//         });
//     }
// }
// // Generate power-ups (releases)
// function createReleases() {
//     if (Math.random() < 0.01) {  // Reduced spawn rate for more spacing
//         releases.push({
//             x: gameWidth,
//             y: Math.random() * (gameHeight - 50),
//             width: 30,
//             height: 30
//         });
//     }
// }
// // Update obstacles and power-ups
// function updateObstaclesAndReleases() {
//     bugs.forEach((bug, index) => {
//         bug.x -= bugSpeed;  // Speed adjusted during gameplay
//         if (bug.x + bug.width < 0) {
//             bugs.splice(index, 1);
//         }
//         // Collision detection with player
//         if (collisionDetection(player, bug)) {
//             gameOver();
//         }
//     });
//     releases.forEach((release, index) => {
//         release.x -= releaseSpeed;  // Speed adjusted during gameplay
//         if (release.x + release.width < 0) {
//             releases.splice(index, 1);
//         }
//         // Collision detection with player
//         if (collisionDetection(player, release)) {
//             score += 10;
//             releases.splice(index, 1);
//         }
//     });
//     // Gradually increase speed based on score
//     if (score > 0 && score % speedIncrementInterval === 0) {
//         bugSpeed += 0.2;
//         releaseSpeed += 0.2;
//     }
// }
// // Collision detection function
// function collisionDetection(rect1: any, rect2: any): boolean {
//     const padding = 5;  // Add some padding to the collision boxes
//     return (
//         rect1.x + padding < rect2.x + rect2.width - padding &&
//         rect1.x + rect1.width - padding > rect2.x + padding &&
//         rect1.y + padding < rect2.y + rect2.height - padding &&
//         rect1.height + rect1.y - padding > rect2.y + padding
//     );
// }
// // Draw game elements
// function draw() {
//     // Clear canvas
//     ctx.clearRect(0, 0, gameWidth, gameHeight);
//     // Draw player
//     ctx.fillStyle = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);
//     // Draw obstacles (bugs)
//     ctx.fillStyle = '#f00';
//     bugs.forEach(bug => {
//         ctx.fillRect(bug.x, bug.y, bug.width, bug.height);
//     });
//     // Draw power-ups (releases)
//     ctx.fillStyle = '#00f';
//     releases.forEach(release => {
//         ctx.fillRect(release.x, release.y, release.width, release.height);
//     });
//     // Draw score
//     ctx.fillStyle = '#fff';
//     ctx.font = '20px Arial';
//     ctx.fillText(`Score: ${score}`, 10, 30);
// }
// // Game over function
// function gameOver() {
//     isGameOver = true;
//     alert(`Game Over! Your score: ${score}`);
//     // Reset game
//     resetGame();
// }
// function resetGame() {
//     score = 0;
//     bugs = [];
//     releases = [];
//     player.x = 50;
//     player.y = gameHeight - 70;
//     player.dy = 0;
//     player.isJumping = false;
//     bugSpeed = initialBugSpeed;  // Reset speed
//     releaseSpeed = initialBugSpeed;  // Reset speed
//     isGameOver = false;
//     gameLoop();
// }
// // Game loop
// function gameLoop() {
//     if (isGameOver) return;
//     handlePlayerMovement();
//     createBugs();
//     createReleases();
//     updateObstaclesAndReleases();
//     draw();
//     requestAnimationFrame(gameLoop);
// }
// // Start game
// document.addEventListener('keydown', (e) => {
//     if (e.code === 'Space') {
//         jump();
//     }
// });
// gameLoop();
