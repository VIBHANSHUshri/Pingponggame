const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// Game variables
let playerScore = 0, aiScore = 0;
let paddleWidth = 10, paddleHeight = 100;
let ballSize = 10;
let ballSpeedX = 4, ballSpeedY = 4;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

// Power-ups
let powerUpActive = false;
let powerUpX, powerUpY, powerUpColor, powerUpType;

// Keyboard controls
let keys = {};

// Difficulty settings
let difficulty = "medium"; // Default difficulty
let aiTrackingSpeed = 0.1; // Medium AI tracking speed
let ballBaseSpeed = 4;

// Event listeners for key presses
window.addEventListener("keydown", (event) => keys[event.key] = true);
window.addEventListener("keyup", (event) => keys[event.key] = false);

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Move player paddle with keyboard
function movePlayer() {
    if (keys["w"] && playerY > 0) playerY -= 10;
    if (keys["s"] && playerY < canvas.height - paddleHeight) playerY += 10;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 30, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw power-up (if active)
    if (powerUpActive) {
        ctx.fillStyle = powerUpColor;
        ctx.beginPath();
        ctx.arc(powerUpX, powerUpY, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

    // Ball collision with paddles
    if (ballX <= 30 && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX = Math.abs(ballSpeedX) + 1;
    } else if (ballX >= canvas.width - 30 && ballY >= aiY && ballY <= aiY + paddleHeight) {
        ballSpeedX = -Math.abs(ballSpeedX) - 1;
    }

    // AI movement based on difficulty
    if (difficulty === "easy") {
        aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1; // Slow tracking
    } else if (difficulty === "medium") {
        aiY += (ballY - (aiY + paddleHeight / 2)) * 0.3; // Partial tracking
    } else if (difficulty === "impossible") {
        aiY += (ballY - (aiY + paddleHeight / 2)) * 0.8; // Full tracking
    }

    // Small random AI movements to make it look natural
    if (Math.random() < 0.02) aiY += (Math.random() > 0.5 ? 20 : -20);

    // Ball out of bounds
    if (ballX <= 0) {
        aiScore++;
        resetGame();
    } else if (ballX >= canvas.width) {
        playerScore++;
        resetGame();
    }

    // Display scores
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("aiScore").textContent = aiScore;

    // Power-up logic
    if (!powerUpActive && Math.random() < 0.005) {
        powerUpActive = true;
        powerUpX = Math.random() * (canvas.width - 50) + 25;
        powerUpY = Math.random() * (canvas.height - 50) + 25;
        
        // Randomly assign power-up type and color
        let powerUps = [
            { color: "green", type: "increasePaddle" }, 
            { color: "red", type: "increaseBallSpeed" }, 
            { color: "blue", type: "decreaseBallSize" }
        ];
        let chosenPower = powerUps[Math.floor(Math.random() * powerUps.length)];
        powerUpColor = chosenPower.color;
        powerUpType = chosenPower.type;
    }

    // Power-up activation
    if (powerUpActive && ballX >= powerUpX - 12 && ballX <= powerUpX + 12 && ballY >= powerUpY - 12 && ballY <= powerUpY + 12) {
        powerUpActive = false;
        applyPowerUp();
    }

    requestAnimationFrame(gameLoop);
}

// Apply power-up effects
function applyPowerUp() {
    if (powerUpType === "increasePaddle") {
        paddleHeight += 20;
    } else if (powerUpType === "increaseBallSpeed") {
        ballSpeedX *= 1.2;
        ballSpeedY *= 1.2;
    } else if (powerUpType === "decreaseBallSize") {
        ballSize = Math.max(5, ballSize - 4);
    }
}

// Reset the game
function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballBaseSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = ballBaseSpeed * (Math.random() > 0.5 ? 1 : -1);
    paddleHeight = 100;
    ballSize = 10;
}

// Change difficulty
function setDifficulty(level) {
    difficulty = level;
    if (level === "easy") {
        aiTrackingSpeed = 0.09;
        ballBaseSpeed = 4;
    } else if (level === "medium") {
        aiTrackingSpeed = 0.12;
        ballBaseSpeed = 5;
    } else if (level === "impossible") {
        aiTrackingSpeed = 0.8;
        ballBaseSpeed = 6;
    }
    resetGame();
}

// Attach event listeners to buttons
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("easyBtn").addEventListener("click", () => setDifficulty("easy"));
document.getElementById("mediumBtn").addEventListener("click", () => setDifficulty("medium"));
document.getElementById("impossibleBtn").addEventListener("click", () => setDifficulty("impossible"));

// Start the game
gameLoop();
