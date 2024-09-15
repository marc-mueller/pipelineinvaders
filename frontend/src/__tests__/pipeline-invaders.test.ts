import { jest } from '@jest/globals';
import { player, shoot, updateBullets, updateEnemies, checkCollision, dropPowerUp, updatePowerUps, activatePowerUp, resetPowerUp, autoShoot, displayMessage, updateScoreboard, gameOver, promptPlayerName, postHighScore, fetchHighScores, openHighscoreDialog, showHighscoreDialog, closeHighscoreDialog, showRestartButton, resetGame, hideRestartButton, gameLoop } from '../pipeline-invaders';

describe('Pipeline Invaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('player should move left when left arrow key is pressed', () => {
    player.x = 100;
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(event);
    gameLoop(0);
    expect(player.x).toBeLessThan(100);
  });

  test('player should move right when right arrow key is pressed', () => {
    player.x = 100;
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(event);
    gameLoop(0);
    expect(player.x).toBeGreaterThan(100);
  });

  test('should shoot bullets when space key is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(event);
    gameLoop(0);
    expect(bullets.length).toBeGreaterThan(0);
  });

  test('should update bullets position', () => {
    bullets.push({ x: 100, y: 100, width: 5, height: 10 });
    updateBullets();
    expect(bullets[0].y).toBeLessThan(100);
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

  test('should auto-shoot when GitHub Copilot power-up is active', () => {
    autoShoot();
    expect(bullets.length).toBeGreaterThan(0);
  });

  test('should display message when power-up is collected', () => {
    displayMessage('Test Message');
    const msgDiv = document.querySelector('div');
    expect(msgDiv).not.toBeNull();
    expect(msgDiv.textContent).toBe('Test Message');
  });

  test('should update scoreboard', () => {
    score = 100;
    serverHealth = 80;
    updateScoreboard();
    expect(document.getElementById('score').textContent).toBe('100');
    expect(document.getElementById('serverHealth').textContent).toBe('80');
  });

  test('should end game when server health reaches zero', () => {
    serverHealth = 0;
    gameOver();
    expect(isGameOver).toBe(true);
  });

  test('should prompt player for name if not already entered', () => {
    localStorage.removeItem('playerName');
    promptPlayerName();
    expect(playerName).not.toBeNull();
  });

  test('should post high score to API', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;
    await postHighScore('Test Player', 100);
    expect(mockFetch).toHaveBeenCalledWith('/api/highscore', expect.any(Object));
  });

  test('should fetch high scores from API', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([{ playerName: 'Test Player', score: 100 }])
    });
    global.fetch = mockFetch;
    await fetchHighScores();
    const highscoreList = document.getElementById('highscoreList');
    expect(highscoreList.children.length).toBeGreaterThan(0);
  });

  test('should open highscore dialog', () => {
    openHighscoreDialog();
    expect(document.getElementById('highscoreDialog').style.display).toBe('block');
  });

  test('should show highscore dialog after game over', () => {
    showHighscoreDialog();
    expect(document.getElementById('highscoreDialog').style.display).toBe('block');
  });

  test('should close highscore dialog', () => {
    closeHighscoreDialog();
    expect(document.getElementById('highscoreDialog').style.display).toBe('none');
  });

  test('should show restart button after game over', () => {
    showRestartButton();
    expect(document.getElementById('restartButton').style.display).toBe('block');
  });

  test('should reset game when restart button is clicked', () => {
    resetGame();
    expect(score).toBe(0);
    expect(serverHealth).toBe(100);
    expect(isGameOver).toBe(false);
  });

  test('should hide restart button after game reset', () => {
    hideRestartButton();
    expect(document.getElementById('restartButton').style.display).toBe('none');
  });
});
