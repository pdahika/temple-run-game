// Global Variables
let scene, camera, renderer, player, roadSegments = [], obstacles = [], coins = [], score = 0;
let playerSpeed = 0.1, playerLane = 0, targetLane = 0, gameOver = false;
let coinSound = new Audio('coin-sound.mp3'), backgroundMusic = new Audio('background-music.mp3');

// Initialize Game
function init() {
  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Light blue sky

  // Camera Setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);
  camera.lookAt(0, 5, 0);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Player Setup
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1), 
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
  player.position.set(0, 1, 0);
  scene.add(player);

  // Game Loop Start
  backgroundMusic.loop = true;
  backgroundMusic.play();
  animate();
}

// Game Loop
function animate() {
  if (gameOver) return; // Stop if game is over

  requestAnimationFrame(animate);

  // Player Movement (forward)
  player.position.z += playerSpeed;

  // Player Lane Switching
  if (targetLane !== playerLane) {
    playerLane += (targetLane - playerLane) * 0.1; // Smooth transition
    player.position.x = playerLane * 3; // Adjust player position
  }

  // Detect Collisions
  checkCollisions();
  checkCoinCollection();

  // Update Road and Obstacles
  updateRoad();
  updateCamera();

  // Render Scene
  renderer.render(scene, camera);
}

// Update Road Segments and Obstacles
function updateRoad() {
  // Road logic (move road segments, create new segments)
}

function updateCamera() {
  camera.position.x = player.position.x;
  camera.position.z = player.position.z - 10;
  camera.lookAt(player.position);
}

// Check Collisions with Obstacles
function checkCollisions() {
  for (let obstacle of obstacles) {
    if (player.position.distanceTo(obstacle.position) < 1) {
      gameOverScreen();
      break;
    }
  }
}

// Coin Collection
function collectCoin() {
  coins += 1;
  score += 10;
  animateScore(score); // Animate score change
  coinSound.play();
  updateScoreUI();
}

// Check Coin Collection
function checkCoinCollection() {
  for (let coin of coins) {
    if (player.position.distanceTo(coin.position) < 1) {
      collectCoin();
    }
  }
}

// Animate Score Change
function animateScore(targetScore) {
  const currentScore = parseInt(document.getElementById('score').innerText, 10);
  if (currentScore < targetScore) {
    document.getElementById('score').innerText = currentScore + 1;
    requestAnimationFrame(() => animateScore(targetScore));
  }
}

// Update Score UI
function updateScoreUI() {
  document.getElementById('score').innerText = score;
  document.getElementById('coins').innerText = coins;
}

// Handle Game Over
function gameOverScreen() {
  gameOver = true;
  document.getElementById('final-score').innerText = score;
  document.getElementById('game-over-screen').classList.add('show');
  backgroundMusic.stop();
}

// Restart Game
function restartGame() {
  score = 0;
  coins = 0;
  gameOver = false;
  player.position.set(0, 1, 0);
  roadSegments = [];
  obstacles = [];
  document.getElementById('game-over-screen').classList.remove('show');
  backgroundMusic.play();
  animate();
}

// Swipe Controls for Mobile
let touchStartX = 0, touchEndX = 0;
window.addEventListener('touchstart', (event) => touchStartX = event.touches[0].clientX);
window.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].clientX;
  if (touchEndX < touchStartX - 50) { // Swipe Left
    if (playerLane > -1) {
      targetLane--;
    }
  } else if (touchEndX > touchStartX + 50) { // Swipe Right
    if (playerLane < 1) {
      targetLane++;
    }
  }
});

// Resize Canvas
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();
