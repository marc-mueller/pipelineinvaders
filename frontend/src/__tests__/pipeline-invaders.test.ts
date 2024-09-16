import { jest } from '@jest/globals';

// Set up the DOM with a canvas element before importing the module
document.body.innerHTML = `
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div id="score"></div>
    <div id="serverHealth"></div>
    <div id="highscoreDialog" style="display: none;"></div>
    <button id="restartButton" style="display: none;"></button>
    <ul id="highscoreList"></ul>
`;

// Mocking the canvas context only in the test environment
let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;

beforeAll(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype.getContext as jest.Mock) = jest.fn(() => ({
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        globalCompositeOperation: '',
        fillStyle: '',
    }));
});

afterAll(() => {
    // Restore original getContext after tests
    HTMLCanvasElement.prototype.getContext = originalGetContext;
});

// Mock window.prompt and fetch with correct types
beforeAll(() => {
    global.prompt = jest.fn() as jest.Mock<(message?: string, _default?: string) => string | null>;
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>; // Correctly mock global.fetch
});

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
} from '../pipeline-invaders';

describe('Pipeline Invaders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset game state using the setter functions
        setScore(0);
        setServerHealth(100);
        setIsGameOver(false);
        setFireRate(500);
        player.x = 100;
        player.speed = 7;
        bullets.length = 0;
        enemies.length = 0;
        powerUps.length = 0;
    });

    test('player should move left when left arrow key is pressed', () => {
        player.x = 100;
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        document.dispatchEvent(event);
        gameLoop(0);
        expect(player.x).toBe(93); // 100 - 7 (player speed)
    });

    test('player should move right when right arrow key is pressed', () => {
        player.x = 100;
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);
        gameLoop(0);
        expect(player.x).toBe(107); // 100 + 7 (player speed)
    });

    test('should shoot bullets when space key is pressed', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        document.dispatchEvent(event);
        gameLoop(0);
        expect(bullets.length).toBe(1);
    });

    test('should update bullets position', () => {
        bullets.push({ x: 100, y: 100, width: 5, height: 10 });
        updateBullets();
        expect(bullets[0].y).toBe(95); // 100 - 5 (bullet speed)
    });

    test('should generate enemies', () => {
        const initialEnemyCount = enemies.length;
        generateEnemies();
        expect(enemies.length).toBeGreaterThan(initialEnemyCount);
    });

    test('should check collision between bullet and enemy', () => {
        const bullet = { x: 100, y: 100, width: 5, height: 10 };
        const enemy = { x: 100, y: 100, width: 40, height: 40, type: 'bug' };
        expect(checkCollision(bullet, enemy)).toBe(true);
    });

    test('should drop power-up when enemy is destroyed', () => {
        const initialPowerUpCount = powerUps.length;
        dropPowerUp(100, 100);
        expect(powerUps.length).toBeGreaterThan(initialPowerUpCount);
    });

    test('should activate power-up', () => {
        activatePowerUp('githubActions');
        expect(fireRate).toBe(200);
    });

    test('should reset power-up effects', () => {
        resetPowerUp();
        expect(fireRate).toBe(500);
        expect(player.speed).toBe(7);
    });

    test('should auto-shoot when GitHub Copilot power-up is active', (done) => {
        autoShoot();
        setTimeout(() => {
            expect(bullets.length).toBeGreaterThan(0);
            done();
        }, 300); // Adjust this delay if needed
    });

    test('should display message when power-up is collected', () => {
        const originalCreateElement = document.createElement;
        document.createElement = jest.fn(() => ({
            style: {},
            textContent: '',
            remove: jest.fn(),
        }) as unknown as HTMLElement); // Cast to unknown to bypass type error

        displayMessage('Test Message');
        expect(document.createElement).toHaveBeenCalledWith('div');
        document.createElement = originalCreateElement; // Restore original function
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
        localStorage.removeItem('playerName');
        const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('Test Player');
        promptPlayerName();
        expect(playerName).toBe('Test Player');
        promptSpy.mockRestore();
    });

    // Uncomment the following tests if you have the backend set up for fetching and posting high scores.

    // test('should post high score to API', async () => {
    //     const mockFetch = jest.fn().mockResolvedValue({
    //         ok: true,
    //         json: async () => ({})
    //     } as Response) as jest.MockedFunction<typeof fetch>;
    //     global.fetch = mockFetch;
    //     await postHighScore('Test Player', 100);
    //     expect(mockFetch).toHaveBeenCalledWith('/api/highscore', expect.any(Object));
    // });

    // test('should fetch high scores from API', async () => {
    //     const mockFetch = jest.fn().mockResolvedValue({
    //         json: async () => [{ playerName: 'Test Player', score: 100 }]
    //     } as Response) as jest.MockedFunction<typeof fetch>;
    //     global.fetch = mockFetch;
    //     const highscoreList = document.getElementById('highscoreList')!;

    //     await fetchHighScores();
    //     expect(highscoreList.children.length).toBeGreaterThan(0);
    // });

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

    test('should reset game when restart button is clicked', () => {
        resetGame();
        expect(score).toBe(0);
        expect(serverHealth).toBe(100);
        expect(isGameOver).toBe(false);
    });

    test('should hide restart button after game reset', () => {
        hideRestartButton();
        const button = document.getElementById('restartButton')!;
        expect(button.style.display).toBe('none');
    });
});
