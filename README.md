# Pipeline Invaders

## Game Concept

**Pipeline Invaders** is a retro-style arcade shooter where the player defends their system from descending bugs and vulnerabilities, simulating the software development and deployment pipeline. The game incorporates **DevOps** themes with enemies representing common challenges such as bugs, vulnerabilities, and misconfigurations, and power-ups symbolizing popular DevOps tools like **GitHub Actions**, **GitHub Copilot**, **GitHub Advanced Security**, and **Kubernetes**.

The player must avoid or destroy enemies by firing "fixes" while collecting power-ups to gain temporary boosts. As the game progresses, enemies become faster and more frequent, simulating increasing complexity in a CI/CD pipeline.

### Gameplay Mechanics

- **Player Controls**: The player controls a DevOps engineer (represented by an SVG character) at the bottom of the screen, moving left and right using the arrow keys.
  - **Shooting**: Press the spacebar to shoot "fixes" upwards to eliminate bugs, vulnerabilities, and misconfigurations.
  - **Objective**: Protect the system's "server health" from enemy threats. The game ends when the server health reaches zero.
  
- **Enemies**: Enemies descend from the top of the screen, representing various challenges:
  - **Bugs**: Represent small issues in the code, easy to destroy.
  - **Vulnerabilities**: Represent security issues, faster and harder to eliminate.
  - **Misconfigurations**: Cause serious damage and require immediate attention.

- **Power-ups**: Power-ups drop when certain enemies are destroyed. Each power-up is linked to a popular DevOps tool, providing different advantages:
  - **GitHub Actions**: Increases the player's fire rate, allowing rapid shooting.
  - **GitHub Copilot**: Automatically shoots bullets for a limited time.
  - **GitHub Advanced Security**: Restores some of the player's server health.
  - **Kubernetes**: Increases player speed, allowing faster movement to avoid enemies.

### Game Flow
- The game starts with slower-moving enemies, gradually increasing in speed and number over time.
- Power-ups provide temporary boosts and can turn the tide in favor of the player.
- The game ends when the player's server health reaches zero, at which point the player can restart the game with a "Restart Game" button.

---

## Technical Details

### 1. Architecture
The game is implemented in **TypeScript** and rendered using the **HTML5 Canvas API**. It is a frontend-only application with no server-side components, making it easy to host on static hosting services or play directly in the browser.

- **Player, enemies, and power-ups** are represented by **SVG images** that are tinted using the `CanvasRenderingContext2D`'s `globalCompositeOperation` to match the color scheme.
- The game's main loop is driven by `requestAnimationFrame`, ensuring smooth frame rendering and animations.

### 2. Player Mechanics
- The player character is represented by a green-tinted SVG image. The player moves left or right using the arrow keys and shoots bullets (represented by white rectangles) by pressing the spacebar.
- Player movement and shooting are updated at a fixed rate, ensuring consistent gameplay regardless of frame rate.

### 3. Enemies
- Enemies are randomly generated at the top of the screen and descend at a fixed speed. The enemy types are:
  - **Bugs** (red-tinted SVG)
  - **Vulnerabilities** (red-tinted SVG)
  - **Misconfigurations** (red-tinted SVG)
- Each enemy has different health and movement speeds, representing varying levels of difficulty.
- Collisions between enemies and bullets are checked using a bounding box collision detection method.

### 4. Power-ups
- When an enemy is destroyed, there is a 20% chance of dropping a power-up.
- Power-ups fall from the enemy's position and are collected by the player when their positions overlap.
- Power-up types are:
  - **GitHub Actions**: Increases fire rate.
  - **GitHub Copilot**: Automatically fires bullets.
  - **GitHub Advanced Security**: Heals the server.
  - **Kubernetes**: Increases player movement speed.
- Power-ups are represented by blue-tinted SVG images and are activated when collected.

### 5. Canvas Rendering
- The **HTML5 Canvas API** is used to draw the player, enemies, power-ups, and bullets. Tinting of images is achieved using the `globalCompositeOperation` set to `source-atop`, allowing a colored rectangle to be applied over the image.

### 6. Game Loop
- The game uses `requestAnimationFrame` for the main game loop. This ensures smooth rendering and gameplay at the browser's native frame rate.
- Each frame, the following actions occur:
  1. The player's position and actions are updated.
  2. Bullets are moved upwards and checked for collisions with enemies.
  3. Enemies are moved downwards and checked for collisions with the player or the bottom of the screen.
  4. Power-ups are updated and drawn.
  5. The player's health and score are updated.
  6. The next frame is requested via `requestAnimationFrame`.

### 7. Power-up Activation and Effects
- Each power-up type has a distinct effect, which lasts for a fixed duration (e.g., 5 seconds). These effects are stored in the `powerUpEffects` object, and their activation is handled by the `activatePowerUp()` function.
- When a power-up is collected, its effect is applied to the player, and a timer is set for the effect's duration.
- After the effect expires, it is reset to its default state.

### 8. Restart Mechanism
- When the game ends (i.e., the server health reaches zero), a "Game Over" message is displayed, and a "Restart Game" button appears on the screen.
- Clicking the "Restart Game" button resets all game variables and restarts the game from the beginning.

## Potential Future Features
- Multiplayer mode: Allow two players to control different sections of the screen.
- Difficulty scaling: Gradually increase the complexity of enemies and their spawn rate.
- Leaderboard: Track and display high scores.
- Additional Power-ups: Include more power-ups such as continuous deployment, code review, or autoscaling.

## File Structure

```
/frontend
  ├── /src
  │     ├── /img
  │     │     ├── bug.svg
  │     │     ├── vulnerability.svg
  │     │     ├── misconfiguration.svg
  │     │     ├── githubactions.svg
  │     │     ├── githubcopilot.svg
  │     │     ├── githubadvancedsecurity.svg
  │     │     ├── kubernetes.svg
  │     │     ├── player.svg
  │     ├── index.html
  │     ├── style.css
  │     ├── pipeline-invaders.ts
  ├── tsconfig.json
  ├── package.json
```

## HTML (index.html)

The game is rendered inside an <html> file that sets up the canvas and basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pipeline Invaders</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Pipeline Invaders</h1>
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div id="scoreboard">
            <p>Score: <span id="score">0</span></p>
            <p>Server Health: <span id="serverHealth">100</span></p>
        </div>
    </div>
    <script src="pipeline-invaders.js"></script>
</body>
</html>
```

## CSS (style.css)

Minimal styling for centering the game and scoreboard:

```css
body {
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #282c34;
    color: white;
}

.container {
    display: inline-block;
    margin-top: 50px;
}

canvas {
    border: 2px solid white;
}

#scoreboard {
    margin-top: 20px;
}

#scoreboard p {
    font-size: 18px;
}
```

## TypeScript configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "outDir": "./dist",             // Output directory for compiled files
    "rootDir": "./src",             // Root directory of input files
    "target": "es5",                // Target ECMAScript version
    "module": "es6",                // Module system (ES6 modules)
    "strict": true,                 // Enable strict type checking options
    "esModuleInterop": true         // Enable interop between CommonJS and ES modules
  },
  "include": [
    "src/**/*.ts"                   // Include all TypeScript files in /src
  ]
}
```

## Packages (package.json)

```json
{
  "name": "pipeline-invaders",
  "version": "1.0.0",
  "description": "Pipeline Invaders game using TypeScript and HTML5 Canvas",
  "scripts": {
    "build": "tsc && npm run copy-assets",
    "copy-assets": "cpy src/**/*.{html,css,svg} dist/ --parents",
    "start": "http-server ./dist -p 5500"
  },
  "devDependencies": {
    "cpy-cli": "^5.0.0",
    "http-server": "^14.1.1",
    "typescript": "^5.5.4"
  }
}
```

## Instructions for Running the Game

1. Clone the repository or download the code files, including the img folder with all the necessary SVGs.
1. Build the application
  
   ```bash
   npm install
   npm run build
   ```
   This will generate the corresponding pipeline-invaders.js file.
   
1. Open index.html in a browser: The game will run automatically, and you can start playing.

   You could also use httpserver to host the game locally. 

   Install the httpserver package globally:
   ```bash
   npm install -g http-server
   ```

   Run the server in the project directory:
   ```bash
   http-server .\dist\
   ```

## Technologies Used
- TypeScript
- HTML5 Canvas
- CSS
- SVG for game assets
