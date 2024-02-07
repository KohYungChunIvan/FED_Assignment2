// (Snake game)

// Hide loading screen after 2 seconds
setTimeout(function () {
  document.getElementById('loading-screen').style.display = 'none';
}, 2000);

// Wait for the page to fully load
window.addEventListener('load', function() {
  // Show the content
  document.getElementById("content").style.display = 'block';
  // Pause the loading animation
  document.getElementById("loading-screen").pause();
});

const gameArea = document.querySelector(".play-board");
const currentScoreDisplay = document.querySelector(".score");
const topScoreDisplay = document.querySelector(".high-score");
const directionControls = document.querySelectorAll(".controls i");

// Load game over sound with the correct path
const soundGameOver = new Audio('photos/gameover.mp3');
soundGameOver.load(); // Preload the game over sound

// Define the path for the food eaten sound
const soundFoodEatenPath = 'photos/eatsound.mp3';

// Initialize variables
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

// Function to generate a random target position on the game board
const generateTargetPosition = () => {
    // Generate random values between 1 and 30 for target position
    targetX = Math.floor(Math.random() * 30) + 1;
    targetY = Math.floor(Math.random() * 30) + 1;
}

// Function to handle food consumption
const consume = () => {
    let playSound = new Audio(soundFoodEatenPath); // Create a new Audio object for food eaten sound
    playSound.play(); // Play the food eaten sound
    currentScore++; // Increase the current score
    handleScoreAchieved(currentScore); // Call a function to handle score achievements
};

// Function to end the game
const endGame = () => {
    enableScrolling(); // Enable scrolling on the page
    soundGameOver.currentTime = 0; // Reset the game over sound to the beginning
    soundGameOver.play(); // Play the game over sound
    clearInterval(gameInterval); // Clear the game interval to stop game updates
    alert("Game Over! Press OK to replay..."); // Show a game over alert
    location.reload(); // Reload the page to replay the game
    window.location.href = 'rewards.html'; // Redirect to rewards.html
}

// Function to modify player's movement direction based on key press
const modifyDirection = e => {
    // Update movement direction based on key press
    if(e.key === "ArrowUp" && moveY != 1) {
        moveX = 0;
        moveY = -1; // Move the player up (decrease Y coordinate)
    } else if(e.key === "ArrowDown" && moveY != -1) {
        moveX = 0;
        moveY = 1; // Move the player down (increase Y coordinate)
    } else if(e.key === "ArrowLeft" && moveX != 1) {
        moveX = -1; // Move the player left (decrease X coordinate)
        moveY = 0;
    } else if(e.key === "ArrowRight" && moveX != -1) {
        moveX = 1; // Move the player right (increase X coordinate)
        moveY = 0;
    }
}
  
// Function to disable scrolling
function disableScrolling() {
    window.addEventListener('keydown', preventArrowScrolling, false); // Add event listener to intercept arrow key presses
}

// Function to enable scrolling
function enableScrolling() {
    window.removeEventListener('keydown', preventArrowScrolling, false); // Remove the event listener to allow scrolling
}

// Function to prevent default arrow key actions
function preventArrowScrolling(e) {
    // Check if the pressed key is one of the arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // Prevent the default scroll behavior when arrow keys are pressed
    }
}

// Attach modifyDirection to clicks on control buttons, passing the key's dataset value as an object
directionControls.forEach(control => control.addEventListener("click", () => modifyDirection({ key: control.dataset.key })));

const startGame = () => {
    disableScrolling(); // Disable scrolling during the game
    if (isGameOver) return endGame(); // End the game if it's already over
    let content = `<div class="food" style="grid-area: ${targetY} / ${targetX}"></div>`;

    // Check if the player's position matches the target position (food eaten)
    if (playerX === targetX && playerY === targetY) {
        consume(); // Handle food consumption
        generateTargetPosition(); // Generate a new target position
        playerTrail.push([targetY, targetX]); // Add the target position to the player's trail
        topScore = currentScore >= topScore ? currentScore : topScore; // Update top score if needed
        localStorage.setItem("high-score", topScore); // Store the updated top score in local storage
        currentScoreDisplay.innerText = `Score: ${currentScore}`; // Update the current score display
        topScoreDisplay.innerText = `High Score: ${topScore}`; // Update the top score display
    }
    playerX += moveX; // Update player's X position based on movement
    playerY += moveY; // Update player's Y position based on movement

    // Update the player's trail based on movement
    for (let i = playerTrail.length - 1; i > 0; i--) {
        playerTrail[i] = playerTrail[i - 1];
    }
    playerTrail[0] = [playerX, playerY];

    // Check if the player hits the game boundaries
    if (playerX <= 0 || playerX > 30 || playerY <= 0 || playerY > 30) {
        return isGameOver = true; // Set game over flag if player hits the boundaries
    }

    // Render the game area and player's trail
    for (let i = 0; i < playerTrail.length; i++) {
        content += `<div class="head" style="grid-area: ${playerTrail[i][1]} / ${playerTrail[i][0]}"></div>`;
        // Check for collision with the player's own trail
        if (i !== 0 && playerTrail[0][1] === playerTrail[i][1] && playerTrail[0][0] === playerTrail[i][0]) {
            isGameOver = true; // Set game over flag if there's a collision with the player's own trail
        }
    }
    gameArea.innerHTML = content; // Update the game area with the new content
}

generateTargetPosition(); // Generate the initial target position
gameInterval = setInterval(startGame, 100); // Set up the game loop to call startGame every 100ms
document.addEventListener("keyup", modifyDirection); // Listen for keyup events to modify the player's direction

// Function to handle achievements and points
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
        showBanner(`Congratulations! You have earned ${pointsToAdd} points.`); // Display a banner for earning points
        try {
            await updateUserPoints(pointsToAdd); // Call updateUserPoints to update the user's points
            displayUserPoints(); // Update the UI with the new points
        } catch (error) {
            console.error('Error updating points:', error);
        }
    }
}


function showBanner(message) {
    const bannerPlaceholder = document.getElementById('banner-placeholder'); // Get the placeholder element where the banner will be displayed
    bannerPlaceholder.innerHTML = `<div class="custom-banner" role="alert">${message}</div>`; // Create the banner with the provided message and insert it into the placeholder
    bannerPlaceholder.style.display = 'block'; // Display the banner placeholder

    // Set styles for the custom banner to style it
    const customBanner = bannerPlaceholder.querySelector('.custom-banner'); // Get the custom banner element
    customBanner.style.backgroundColor = '#762929'; // Set the background color of the banner
    customBanner.style.color = 'white'; // Set the text color to white
    customBanner.style.width = '100%'; // Ensure it covers the full width of the viewport
    customBanner.style.height = '64px'; // Set the height of the banner
    customBanner.style.lineHeight = '48px'; // Center the text vertically within the banner
    customBanner.style.padding = '10px 0'; // Add vertical padding to the banner
    customBanner.style.textAlign = 'center'; // Center the text horizontally within the banner
    customBanner.style.position = 'fixed'; // Fix the position of the banner
    customBanner.style.top = '0'; // Position the banner at the top of the page
    customBanner.style.left = '0'; // Align the banner to the left
    customBanner.style.zIndex = '1030'; // Set a high z-index to ensure it appears above other elements

    // Automatically hide the banner after 3 seconds
    setTimeout(() => {
        bannerPlaceholder.style.display = 'none'; // Hide the banner placeholder after 3 seconds
    }, 3000);
}
