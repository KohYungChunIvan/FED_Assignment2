// Second game (Snake game)

const gameArea = document.querySelector(".play-board");
const currentScoreDisplay = document.querySelector(".score");
const topScoreDisplay = document.querySelector(".high-score");
const directionControls = document.querySelectorAll(".controls i");

const soundGameOver = new Audio('photos/gameover.mp3'); // Verify path correctness

soundGameOver.load(); // Preload the game over sound

const soundFoodEatenPath = 'photos/eatsound.mp3'; // Verify path correctness

let pointsThresholdReached = 0; // Added a variable to track the last threshold reached


let isGameOver = false;
let targetX, targetY;
let playerX = 5, playerY = 5;
let moveX = 0, moveY = 0;
let playerTrail = [];
let gameInterval;
let currentScore = 0;

// Retrieve the high score from local storage
let topScore = localStorage.getItem("high-score") || 0;
topScoreDisplay.innerText = `High Score: ${topScore}`;

const generateTargetPosition = () => {
    // Random 1 - 30 values for target position
    targetX = Math.floor(Math.random() * 30) + 1;
    targetY = Math.floor(Math.random() * 30) + 1;
}

const consume = () => {
  let playSound = new Audio(soundFoodEatenPath);
  playSound.play();
  currentScore++;
  handleScoreAchieved(currentScore);
};

const endGame = () => {
    enableScrolling();
    soundGameOver.currentTime = 0; // Start from beginning
    soundGameOver.play();
    clearInterval(gameInterval);
    alert("Game Over! Press OK to replay...");
    location.reload();
    window.location.href = 'rewards.html';
}

const modifyDirection = e => {
    // Update movement direction based on key press
    if(e.key === "ArrowUp" && moveY != 1) {
        moveX = 0;
        moveY = -1;
    } else if(e.key === "ArrowDown" && moveY != -1) {
        moveX = 0;
        moveY = 1;
    } else if(e.key === "ArrowLeft" && moveX != 1) {
        moveX = -1;
        moveY = 0;
    } else if(e.key === "ArrowRight" && moveX != -1) {
        moveX = 1;
        moveY = 0;
    }
}
// Function to disable scrolling
function disableScrolling() {
    window.addEventListener('keydown', preventArrowScrolling, false);
}

// Function to enable scrolling
function enableScrolling() {
    window.removeEventListener('keydown', preventArrowScrolling, false);
}

// Function to prevent default arrow key actions
function preventArrowScrolling(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    }
}

// Attach modifyDirection to clicks on control buttons, passing the key's dataset value as an object
directionControls.forEach(control => control.addEventListener("click", () => modifyDirection({ key: control.dataset.key })));

const startGame = () => {
    disableScrolling();
    if(isGameOver) return endGame();
    let content = `<div class="food" style="grid-area: ${targetY} / ${targetX}"></div>`;

    if(playerX === targetX && playerY === targetY) {
        consume();
        generateTargetPosition();
        playerTrail.push([targetY, targetX]);
        topScore = currentScore >= topScore ? currentScore : topScore;
        localStorage.setItem("high-score", topScore);
        currentScoreDisplay.innerText = `Score: ${currentScore}`;
        topScoreDisplay.innerText = `High Score: ${topScore}`;
    }
    playerX += moveX;
    playerY += moveY;

    for (let i = playerTrail.length - 1; i > 0; i--) {
        playerTrail[i] = playerTrail[i - 1];
    }
    playerTrail[0] = [playerX, playerY];

    if(playerX <= 0 || playerX > 30 || playerY <= 0 || playerY > 30) {
        return isGameOver = true;
    }

    for (let i = 0; i < playerTrail.length; i++) {
        content += `<div class="head" style="grid-area: ${playerTrail[i][1]} / ${playerTrail[i][0]}"></div>`;
        if (i !== 0 && playerTrail[0][1] === playerTrail[i][1] && playerTrail[0][0] === playerTrail[i][0]) {
            isGameOver = true;
        }
    }
    gameArea.innerHTML = content;
}

generateTargetPosition();
gameInterval = setInterval(startGame, 100);
document.addEventListener("keyup", modifyDirection);

async function handleScoreAchieved(score) {
    let pointsToAdd = 0;

    // Determine points to add based on score thresholds and ensure that points are added only once per threshold
    if (score === 10 && pointsThresholdReached < 10) {
        pointsToAdd = 20;
        pointsThresholdReached = 10;
    } else if (score === 20 && pointsThresholdReached < 20) {
        pointsToAdd = 50;
        pointsThresholdReached = 20;
    } else if (score === 30 && pointsThresholdReached < 30) {
        pointsToAdd = 100;
        pointsThresholdReached = 30;
    } else if (score === 40 && pointsThresholdReached < 40) {
        pointsToAdd = 200;
        pointsThresholdReached = 40;
    }

    if (pointsToAdd > 0) {
        showBanner(`Congratulations! You have earned ${pointsToAdd} points.`);
        try {
            await updateUserPoints(pointsToAdd);
            displayUserPoints(); // Update the UI with the new points
        } catch (error) {
            console.error('Error updating points:', error);
        }
    }
}

function showBanner(message) {
    const bannerPlaceholder = document.getElementById('banner-placeholder');
    bannerPlaceholder.innerHTML = `<div class="custom-banner" role="alert">${message}</div>`;
    bannerPlaceholder.style.display = 'block';

    // Set styles for the custom banner
    const customBanner = bannerPlaceholder.querySelector('.custom-banner');
    customBanner.style.backgroundColor = '#762929'; // Set the background color
    customBanner.style.color = 'white'; // Set the text color to white
    customBanner.style.width = '100%'; // Ensure it covers the full width
    customBanner.style.height = '64px'; // Set the height to be tall enough to cover the navbar
    customBanner.style.lineHeight = '48px'; // Center the text vertically
    customBanner.style.padding = '10px 0'; // Add some vertical padding
    customBanner.style.textAlign = 'center'; // Center the text
    customBanner.style.position = 'fixed'; // Fix position to the top
    customBanner.style.top = '0'; // Position at the top of the page
    customBanner.style.left = '0'; // Align to the left
    customBanner.style.zIndex = '1030'; // Ensure it is on top of other elements

    // Automatically hide the banner after 3 seconds
    setTimeout(() => {
        bannerPlaceholder.style.display = 'none';
    }, 3000);
}