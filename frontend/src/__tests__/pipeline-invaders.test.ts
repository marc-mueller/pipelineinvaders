import { jest } from '@jest/globals';

// Mock window.prompt before importing the module
(global as any).prompt = jest.fn();

// Define a minimal Response interface
interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
}

// Mock fetch with correct types
(global as any).fetch = jest.fn().mockImplementation((): Promise<MockResponse> => {
  const mockResponse: MockResponse = {
    ok: true,
    status: 200,
    json: () => Promise.resolve([]),
  };
  return Promise.resolve(mockResponse);
});

// Set up the DOM
document.body.innerHTML = `
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div id="score"></div>
    <div id="serverHealth"></div>
    <div id="highscoreDialog" style="display: none;"></div>
    <button id="restartButton" style="display: none;"></button>
    <ul id="highscoreList"></ul>
`;

// Mock canvas context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn().mockImplementation(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    drawImage: jest.fn(),
    globalCompositeOperation: '',
    fillStyle: '',
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    font: '',
  })),
});

// Mock localStorage
const localStorageMock: jest.Mocked<Storage> = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Capture event handlers
let keyDownHandler: (e: KeyboardEvent) => void = () => {};
let keyUpHandler: (e: KeyboardEvent) => void = () => {};

jest.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
  if (event === 'keydown') {
    keyDownHandler = handler as (e: KeyboardEvent) => void;
  } else if (event === 'keyup') {
    keyUpHandler = handler as (e: KeyboardEvent) => void;
  }
});

// Now import your module
import {
  score,
  serverHealth,
  isGameOver,
  fireRate,
  player,
  bullets,
  enemies,
  powerUps,
  gameLoop,
  shoot,
  updateBullets,
  generateEnemies,
  updateEnemies,
  checkCollision,
  dropPowerUp,
  updatePowerUps,
  activatePowerUp,
  resetPowerUp,
  autoShoot,
  displayMessage,
  updateScoreboard,
  gameOver,
  promptPlayerName,
  postHighScore,
  fetchHighScores,
  openHighscoreDialog,
  showHighscoreDialog,
  closeHighscoreDialog,
  showRestartButton,
  resetGame,
  hideRestartButton,
  playerName,
  setScore,
  setServerHealth,
  setIsGameOver,
  setFireRate,
  setPlayerName, // Import the setter function
} from '../pipeline-invaders';

describe('Pipeline Invaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setScore(0);
    setServerHealth(100);
    setIsGameOver(false);
    setFireRate(500);
    player.x = 100;
    player.speed = 7;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;
    // Reset playerName using the setter
    setPlayerName(null);
  });

  test('player should move left when left arrow key is pressed', () => {
    player.x = 100;

    // Simulate pressing the left arrow key
    keyDownHandler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    gameLoop(0);
    expect(player.x).toBe(93); // 100 - 7 (player speed)

    // Simulate releasing the left arrow key
    keyUpHandler(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
  });

  test('player should move right when right arrow key is pressed', () => {
    player.x = 100;

    // Simulate pressing the right arrow key
    keyDownHandler(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    gameLoop(0);
    expect(player.x).toBe(107); // 100 + 7 (player speed)

    // Simulate releasing the right arrow key
    keyUpHandler(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
  });

//   test('should shoot bullets when space key is pressed', () => {
//     // Simulate pressing the space key
//     keyDownHandler(new KeyboardEvent('keydown', { key: ' ' }));

//     gameLoop(0);
//     expect(bullets.length).toBe(1);

//     // Simulate releasing the space key
//     keyUpHandler(new KeyboardEvent('keyup', { key: ' ' }));
//   });

  test('should update bullets position', () => {
    bullets.push({ x: 100, y: 100, width: 5, height: 10 });
    updateBullets();
    expect(bullets[0].y).toBe(95); // 100 - 5 (bullet speed)
  });

  test('should generate enemies', () => {
    const initialEnemyCount = enemies.length;
    jest.spyOn(Math, 'random').mockReturnValue(0.01); // Force enemy generation
    generateEnemies();
    expect(enemies.length).toBeGreaterThan(initialEnemyCount);
    jest.spyOn(Math, 'random').mockRestore();
  });

  test('should check collision between bullet and enemy', () => {
    const bullet = { x: 100, y: 100, width: 5, height: 10 };
    const enemy = { x: 100, y: 100, width: 40, height: 40, type: 'bug' };
    expect(checkCollision(bullet, enemy)).toBe(true);
  });

  test('should drop power-up when enemy is destroyed', () => {
    const initialPowerUpCount = powerUps.length;
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // Force power-up drop
    dropPowerUp(100, 100);
    expect(powerUps.length).toBeGreaterThan(initialPowerUpCount);
    jest.spyOn(Math, 'random').mockRestore();
  });

  test('should activate power-up', () => {
    activatePowerUp('githubActions');
    expect(fireRate).toBe(200); // As per the powerUpEffects
  });

//   test('should reset power-up effects', () => {
//     fireRate = 200; // Simulate a power-up effect
//     player.speed = 15; // Simulate another power-up effect
//     resetPowerUp();
//     expect(fireRate).toBe(500);
//     expect(player.speed).toBe(7);
//   });

  test('should auto-shoot when GitHub Copilot power-up is active', (done) => {
    setFireRate(100); // Set fire rate to 100ms
    autoShoot();
    setTimeout(() => {
      expect(bullets.length).toBeGreaterThan(0);
      done();
    }, 150); // Slightly longer than fireRate
  });

  test('should display message when power-up is collected', () => {
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    displayMessage('Test Message');
    expect(appendChildSpy).toHaveBeenCalled();
    appendChildSpy.mockRestore();
  });

  test('should update scoreboard', () => {
    const scoreElement = document.getElementById('score')!;
    const serverHealthElement = document.getElementById('serverHealth')!;

    setScore(100);
    setServerHealth(80);
    updateScoreboard();
    expect(scoreElement.textContent).toBe('100');
    expect(serverHealthElement.textContent).toBe('80');
  });

  test('should end game when server health reaches zero', () => {
    setServerHealth(0);
    gameOver();
    expect(isGameOver).toBe(true);
  });

  test('should prompt player for name if not already entered', () => {
    localStorageMock.getItem.mockReturnValue(null);
    // Reset playerName using the setter
    setPlayerName(null);

    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('Test Player');
    promptPlayerName();
    expect(playerName).toBe('Test Player');
    promptSpy.mockRestore();
  });

  test('should open highscore dialog', () => {
    openHighscoreDialog();
    const dialog = document.getElementById('highscoreDialog')!;
    expect(dialog.style.display).toBe('block');
  });

  test('should show highscore dialog after game over', () => {
    showHighscoreDialog();
    const dialog = document.getElementById('highscoreDialog')!;
    expect(dialog.style.display).toBe('block');
  });

  test('should close highscore dialog', () => {
    closeHighscoreDialog();
    const dialog = document.getElementById('highscoreDialog')!;
    expect(dialog.style.display).toBe('none');
  });

  test('should show restart button after game over', () => {
    showRestartButton();
    const button = document.getElementById('restartButton')!;
    expect(button.style.display).toBe('block');
  });

//   test('should reset game when restart button is clicked', () => {
//     // Simulate game over state
//     setIsGameOver(true);
//     setScore(50);
//     setServerHealth(0);

//     resetGame();

//     expect(score).toBe(0);
//     expect(serverHealth).toBe(100);
//     expect(isGameOver).toBe(false);
//     expect(bullets.length).toBe(0);
//     expect(enemies.length).toBe(0);
//     expect(powerUps.length).toBe(0);
//     expect(player.x).toBe(100); // Reset to initial position (canvas.width / 2 - 25)
//     expect(fireRate).toBe(500);
//     expect(player.speed).toBe(7);
//   });

  test('should hide restart button after game reset', () => {
    showRestartButton(); // Show it first
    hideRestartButton();
    const button = document.getElementById('restartButton')!;
    expect(button.style.display).toBe('none');
  });
});
