// Third Game Flappy Bird

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

// Game Initialization
window.onload = function() {
    // Get the canvas and context
    const cvs = document.getElementById("bird");
    const ctx = cvs.getContext("2d");

    // Game Variables and Constants
    let frames = 0; // Frame counter for animations
    const DEGREE = Math.PI / 180; // Convert degrees to radians for rotation

    // Load Sprite Image
    const sprite = new Image(); // Create a new image object
    sprite.src = "photos/flappy.png"; // Set the source of the image

    // Improved Sound Handling
    function createSound(src) {
        const sound = new Audio(src); // Create a new audio object
        sound.preload = 'auto'; // Set preload attribute to auto for preloading
        sound.load(); // Explicitly call load to start loading the sound
        return sound; // Return the sound object
    }

    // Function to manage sound playing
    function playSound(sound) {
        // Play or replay a sound without creating multiple instances
        if (sound.paused) {
            sound.play().catch(e => console.error("Error playing sound:", e)); // Play the sound if paused
        } else {
            sound.currentTime = 0; // Reset sound to start if it was already playing
            sound.play().catch(e => console.error("Error playing sound:", e)); // Play the sound
        }
    }

    // Load Sounds
    const SCORE_S = createSound("photos/flappy sound/sfx_point.wav"); // Sound for scoring
    const FLAP = createSound("photos/flappy sound/sfx_flap.wav"); // Sound for flapping
    const HIT = createSound("photos/flappy sound/sfx_hit.wav"); // Sound for hitting an obstacle
    const SWOOSHING = createSound("photos/flappy sound/sfx_swooshing.wav"); // Sound for swooshing
    const DIE = createSound("photos/flappy sound/sfx_die.wav"); // Sound for dying

    // Example usage in the game flow
    cvs.addEventListener("click", function(evt) {
        // Play swooshing sound on canvas click
        playSound(SWOOSHING); // Play the swooshing sound
    });

    // Game State
    const state = {
        current: 0, // Current state of the game
        getReady: 0, // State when getting ready to start
        game: 1, // State during the game
        over: 2 // State when the game is over
    };

    // Start Button Coordinates
    const startBtn = {
        x: 120, // X coordinate
        y: 263, // Y coordinate
        w: 83, // Width
        h: 29 // Height
    };

    // Control the game
    cvs.addEventListener("click", function(evt) {
        switch (state.current) {
            case state.getReady:
                state.current = state.game; // Change to game state
                SWOOSHING.play(); // Play swooshing sound
                break;
            case state.game:
                // Prevent bird from flying out of bounds
                if (bird.y - bird.radius <= 0) return;
                bird.flap(); // Make the bird flap
                FLAP.play(); // Play flap sound
                break;
            case state.over:
                // Get click coordinates relative to canvas
                let rect = cvs.getBoundingClientRect();
                let clickX = evt.clientX - rect.left;
                let clickY = evt.clientY - rect.top;

                // Check if click is on the Start button
                if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                    // Reset the game
                    pipes.reset();
                    bird.speedReset();
                    score.reset();
                    state.current = state.getReady;
                }
                break;
        }
    });

    // Background
    const bg = {
        sX: 0, // Source x position
        sY: 0, // Source y position
        w: 275, // Width
        h: 226, // Height
        x: 0, // Destination x position
        y: cvs.height - 226, // Destination y position (adjust to fit at the bottom)

        draw: function() {
            // Draw the background image twice to fill the canvas width
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        }
    };

    // Foreground
    const fg = {
        sX: 276, // Source x position
        sY: 0, // Source y position
        w: 224, // Width
        h: 112, // Height
        x: 0, // Destination x position
        y: cvs.height - 112, // Destination y position (adjust to fit at the bottom)
        dx: 2, // Speed of the foreground movement

        draw: function() {
            // Draw the foreground twice to fill the canvas width
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        },

        update: function() {
            // Move the foreground only during the game state
            if (state.current === state.game) {
                this.x = (this.x - this.dx) % (this.w / 2); // Loop the foreground
            }
        }
    };

    // Bird
    const bird = {
        animation: [ // Bird animation frames
            {sX: 276, sY: 112},
            {sX: 276, sY: 139},
            {sX: 276, sY: 164},
            {sX: 276, sY: 139}
        ],
        x: 50, // X coordinate
        y: 150, // Y coordinate
        w: 34, // Width
        h: 26, // Height

        radius: 12, // Collision radius
        frame: 0, // Current animation frame

        gravity: 0.25, // Gravity effect
        jump: 4.6, // Jump strength
        speed: 0, // Current speed
        rotation: 0, // Rotation angle

        draw: function() {
            // Get the current frame of the bird
            let bird = this.animation[this.frame];

            // Save the canvas context state
            ctx.save();
            // Translate and rotate the canvas context for bird rotation
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            // Draw the bird with rotation applied
            ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

            // Restore the canvas context to its original state
            ctx.restore();
        },

        flap: function() {
            this.speed = -this.jump; // Apply jump speed (negative to move up)
        },

        update: function() {
            // Slow down the flap animation in the get ready state and speed it up in the game state
            this.period = state.current === state.getReady ? 10 : 5;
            // Increment frame by 1 each period to animate the bird
            this.frame += frames % this.period === 0 ? 1 : 0;
            // Loop animation frames
            this.frame %= this.animation.length;

            if (state.current === state.getReady) {
                // Reset bird position and rotation after game over
                this.y = 150;
                this.rotation = 0 * DEGREE;
            } else {
                // Apply gravity to speed and update position
                this.speed += this.gravity;
                this.y += this.speed;

                if (this.y + this.h / 2 >= cvs.height - fg.h) {
                    // Prevent bird from falling below the foreground
                    this.y = cvs.height - fg.h - this.h / 2;
                    if (state.current === state.game) {
                        // End the game if bird hits the ground
                        state.current = state.over;
                        DIE.play(); // Play die sound
                    }
                }

                // Rotate the bird based on its speed
                this.rotation = this.speed >= this.jump ? 90 * DEGREE : -25 * DEGREE;
            }
        },

        speedReset: function() {
            this.speed = 0; // Reset speed to 0
        }
    };

    // Get Ready Message
    const getReady = {
        sX: 0, // Source x position
        sY: 228, // Source y position
        w: 173, // Width
        h: 152, // Height
        x: cvs.width / 2 - 173 / 2, // Center on canvas
        y: 80, // Y coordinate

        draw: function() {
            // Draw get ready message only in get ready state
            if (state.current === state.getReady) {
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    };

    // Game Over Message
    const gameOver = {
        sX: 175, // Source x position
        sY: 228, // Source y position
        w: 225, // Width
        h: 202, // Height
        x: cvs.width / 2 - 225 / 2, // Center on canvas
        y: 90, // Y coordinate

        draw: function() {
            // Draw game over message only in game over state
            if (state.current === state.over) {
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    };

    // Pipes
    const pipes = {
        position: [], // Array to hold pipe positions

        top: {
            sX: 553,
            sY: 0
        },
        bottom: {
            sX: 502,
            sY: 0
        },

        w: 53, // Width
        h: 400, // Height
        gap: 85, // Gap between top and bottom pipe
        maxYPos: -150, // Maximum Y position for the top pipe
        dx: 2, // Speed of the pipes moving to the left

        draw: function() {
            // Draw all pipes in the array
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                let topYPos = p.y;
                let bottomYPos = p.y + this.h + this.gap;

                // Draw top pipe
                ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

                // Draw bottom pipe
                ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
            }
        },

        update: function() {
            // Update pipes position only during the game state
            if (state.current !== state.game) return;

            if (frames % 100 === 0) {
                // Add a new pipe every 100 frames
                this.position.push({
                    x: cvs.width,
                    y: this.maxYPos * (Math.random() + 1)
                });
            }
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];

                // Move the pipe to the left
                p.x -= this.dx;

                // Remove pipe when it goes beyond canvas
                if (p.x + this.w <= 0) {
                    this.position.shift(); // Remove the first element
                    score.value += 1; // Increment score
                    SCORE_S.play(); // Play scoring sound
                    score.best = Math.max(score.value, score.best); // Update best score
                    localStorage.setItem("best", score.best.toString()); // Save best score to localStorage
                }

                // Collision detection with the bird
                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h ||
                    bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y + this.h + this.gap && bird.y - bird.radius < p.y + this.h + this.gap + this.h) {
                    state.current = state.over; // Change to game over state
                    HIT.play(); // Play hit sound
                }
            }
        },

        reset: function() {
            this.position = []; // Clear all pipes
        }
    };

    // Score
    const score = {
        best: parseInt(localStorage.getItem("best")) || 0, // Get best score from localStorage or 0
        value: 0, // Current score

        draw: function() {
            ctx.fillStyle = "#FFF"; // Set fill color to white
            ctx.strokeStyle = "#000"; // Set stroke color to black

            if (state.current === state.game) {
                // Draw current score in game state
                ctx.font = "35px Teko";
                ctx.fillText(this.value, cvs.width / 2, 50);
                ctx.strokeText(this.value, cvs.width / 2, 50);
            } else if (state.current === state.over) {
                // Draw score and best score in game over state
                ctx.font = "25px Teko";
                ctx.fillText(this.value, 225, 186);
                ctx.strokeText(this.value, 225, 186);
                // Best score
                ctx.fillText(this.best, 225, 228);
                ctx.strokeText(this.best, 225, 228);
            }
        },

        reset: function() {
            this.value = 0; // Reset score to 0
        }
    };

    // Draw Function
    function draw() {
        // Fill canvas background with a color
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Call draw methods of game objects
        bg.draw();
        pipes.draw();
        fg.draw();
        bird.draw();
        getReady.draw();
        gameOver.draw();
        score.draw();
    }

    // Update Function
    function update() {
        // Call update methods of game objects
        bird.update();
        fg.update();
        pipes.update();
    }

    // Function to calculate points based on the score
    function calculatePoints(score) {
        if (score <= 5) {
            return score * 10;
        } else {
            return (score - 5) * 50 + 50;
        }
    }
    // Define a flag to indicate whether the game over logic has already been executed
    let hasHandledGameOver = false;

    // Loop Function
    function loop() {
        update(); // Update game objects
        draw(); // Draw game objects
        frames++; // Increment frame counter
        if (state.current === state.over) {
            if (!hasHandledGameOver) {
                handleGameOver(); // Handle game over logic once
            }
        } else {
            // Reset the flag if the game is not over
            hasHandledGameOver = false;
        }

        requestAnimationFrame(loop); // Call loop again for the next frame
    }
    // Game Over Handler
    function handleGameOver() {
        // Set the flag to true to avoid duplicate handling
        hasHandledGameOver = true;

        // Calculate the points earned based on the final score
        const pointsEarned = calculatePoints(score.value);

        // Asynchronously update user points and handle UI response
        updateUserPoints(pointsEarned)
            .then(() => {
                alert(`Congratulations! You have earned ${pointsEarned} points.`);
                window.location.href = 'rewards.html'; // Redirect to the rewards page
            })
            .catch((error) => {
                console.error('Error updating points:', error);
            });
    }

    sprite.onload = loop; // Start the game loop once the sprite has loaded
};
