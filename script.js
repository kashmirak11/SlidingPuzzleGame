const levelScreen = document.getElementById('level-screen');
const gameContainer = document.getElementById('game-container');
const puzzleGrid = document.getElementById('puzzle-grid');
const attemptsLeftEl = document.getElementById('attempts-left');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const finalScore = document.getElementById('final-score');
const celebration = document.getElementById('celebration');
const shuffleBtn = document.getElementById('shuffle-btn');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');

let tiles = [];
let emptyIndex = 8;
let attemptsLeft = 20;

const levelAttempts = {
  easy: 30,
  medium: 20,
  hard: 10
};

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;
    attemptsLeft = levelAttempts[level];
    attemptsLeftEl.textContent = attemptsLeft;
    applyLevelStyles(level);
    startGame();
    levelScreen.style.display = 'none';
    gameContainer.style.display = 'block';
  });
});

function applyLevelStyles(level) {
  // Example of visually styling the game container for different levels
  if (level === 'easy') {
    gameContainer.style.background = '#e0f7fa'; // light blue for easy
  } else if (level === 'medium') {
    gameContainer.style.background = '#fff9c4'; // light yellow for medium
  } else if (level === 'hard') {
    gameContainer.style.background = '#ffccbc'; // light red for hard
  }
}

function startGame() {
  tiles = [1, 2, 3, 4, 5, 6, 7, 8, ""];
  shuffleTiles();
  renderTiles();
}

function shuffleTiles() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  emptyIndex = tiles.indexOf("");
}

function renderTiles() {
  puzzleGrid.innerHTML = '';
  tiles.forEach((tile, idx) => {
    const div = document.createElement('div');
    div.classList.add('puzzle-tile');
    if (tile !== "") div.textContent = tile;
    div.addEventListener('click', () => moveTile(idx));
    puzzleGrid.appendChild(div);
  });
}

function moveTile(idx) {
  const validMoves = [
    idx - 1, idx + 1,
    idx - 3, idx + 3
  ].filter(i => i >= 0 && i < 9 && (i % 3 !== 3 || idx % 3 !== 0));

  if (validMoves.includes(emptyIndex)) {
    [tiles[idx], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[idx]];
    emptyIndex = idx;
    renderTiles();
    attemptsLeft--;
    attemptsLeftEl.textContent = attemptsLeft;
    checkWinOrLoss();
  }
}

function checkWinOrLoss() {
  if (tiles.join('') === '12345678') {
    showResult('🎉 You Win!', attemptsLeft);
  } else if (attemptsLeft <= 0) {
    showResult('💔 You Lose!', 0);
  }
}

function showResult(message, score) {
  resultMessage.textContent = message;
  finalScore.textContent = `⭐ Your Score: ${score}`;
  gameContainer.style.display = 'none';
  resultScreen.style.display = 'flex';
  triggerCelebration(message === '🎉 You Win!');
}

function triggerCelebration(isWin) {
  celebration.innerHTML = '';
  if (isWin) {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      celebration.appendChild(confetti);
    }
  }
}

shuffleBtn.addEventListener('click', () => {
  shuffleTiles();
  renderTiles();
});

newGameBtn.addEventListener('click', () => location.reload());
playAgainBtn.addEventListener('click', () => location.reload());
