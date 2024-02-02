// Third Game Flappy Bird



// Game Initialization
window.onload = function() {
    const cvs = document.getElementById("bird");
    const ctx = cvs.getContext("2d");

    // Game Variables and Constants
    let frames = 0;
    const DEGREE = Math.PI / 180;

    // Load Sprite Image
    const sprite = new Image();
    sprite.src = "photos/flappy.png";

    // Improved Sound Handling
    function createSound(src) {
        const sound = new Audio(src);
        sound.preload = 'auto'; // Ensure the sound is preloaded
        sound.load(); // Explicitly call load to start loading the sound
        return sound;
    }

    // Function to manage sound playing
    function playSound(sound) {
        // Instead of cloning the sound, directly manipulate and play the original sound object
        if (sound.paused) {
            sound.play().catch(e => console.error("Error playing sound:", e));
        } else {
            sound.currentTime = 0; // Reset sound to start if it was already playing
            sound.play().catch(e => console.error("Error playing sound:", e));
        }
    }

    // Load Sounds
    const SCORE_S = createSound("photos/flappy sound/sfx_point.wav");
    const FLAP = createSound("photos/flappy sound/sfx_flap.wav");
    const HIT = createSound("photos/flappy sound/sfx_hit.wav");
    const SWOOSHING = createSound("photos/flappy sound/sfx_swooshing.wav");
    const DIE = createSound("photos/flappy sound/sfx_die.wav");

    // Example usage in the game flow
    cvs.addEventListener("click", function(evt) {
        // Handle game state changes and play sounds as necessary
        // Use playSound function to play a sound effect, e.g.,
        playSound(SWOOSHING); // Whenever you need to play the swooshing sound
    });

    // Game State
    const state = {
        current: 0,
        getReady: 0,
        game: 1,
        over: 2
    };

    // Start Button Coordinates
    const startBtn = {
        x: 120,
        y: 263,
        w: 83,
        h: 29
    };

    // Control the game
    cvs.addEventListener("click", function(evt) {
        switch (state.current) {
            case state.getReady:
                state.current = state.game;
                SWOOSHING.play();
                break;
            case state.game:
                if (bird.y - bird.radius <= 0) return;
                bird.flap();
                FLAP.play();
                break;
            case state.over:
                let rect = cvs.getBoundingClientRect();
                let clickX = evt.clientX - rect.left;
                let clickY = evt.clientY - rect.top;

                // Check if we click on the Start button
                if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
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
        sX: 0,
        sY: 0,
        w: 275,
        h: 226,
        x: 0,
        y: cvs.height - 226,

        draw: function() {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        }
    };

    // Foreground
    const fg = {
        sX: 276,
        sY: 0,
        w: 224,
        h: 112,
        x: 0,
        y: cvs.height - 112,
        dx: 2,

        draw: function() {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        },

        update: function() {
            if (state.current === state.game) {
                this.x = (this.x - this.dx) % (this.w / 2);
            }
        }
    };

    // Bird
    const bird = {
        animation: [
            {sX: 276, sY: 112},
            {sX: 276, sY: 139},
            {sX: 276, sY: 164},
            {sX: 276, sY: 139}
        ],
        x: 50,
        y: 150,
        w: 34,
        h: 26,

        radius: 12,
        frame: 0,

        gravity: 0.25,
        jump: 4.6,
        speed: 0,
        rotation: 0,

        draw: function() {
            let bird = this.animation[this.frame];

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

            ctx.restore();
        },

        flap: function() {
            this.speed = -this.jump;
        },

        update: function() {
            // The bird must flap slowly in the get ready state and faster in the game state
            this.period = state.current === state.getReady ? 10 : 5;
            this.frame += frames % this.period === 0 ? 1 : 0;
            this.frame %= this.animation.length;

            if (state.current === state.getReady) {
                this.y = 150; // Reset position after game over
                this.rotation = 0 * DEGREE;
            } else {
                this.speed += this.gravity;
                this.y += this.speed;

                if (this.y + this.h / 2 >= cvs.height - fg.h) {
                    this.y = cvs.height - fg.h - this.h / 2;
                    if (state.current === state.game) {
                        state.current = state.over;
                        DIE.play();
                    }
                }

                // If the speed is greater than the jump, the bird is falling down
                this.rotation = this.speed >= this.jump ? 90 * DEGREE : -25 * DEGREE;
            }
        },

        speedReset: function() {
            this.speed = 0;
        }
    };

    // Get Ready Message
    const getReady = {
        sX: 0,
        sY: 228,
        w: 173,
        h: 152,
        x: cvs.width / 2 - 173 / 2,
        y: 80,

        draw: function() {
            if (state.current === state.getReady) {
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    };

    // Game Over Message
    const gameOver = {
        sX: 175,
        sY: 228,
        w: 225,
        h: 202,
        x: cvs.width / 2 - 225 / 2,
        y: 90,

        draw: function() {
            if (state.current === state.over) {
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    };

    // Pipes
    const pipes = {
        position: [],

        top: {
            sX: 553,
            sY: 0
        },
        bottom: {
            sX: 502,
            sY: 0
        },

        w: 53,
        h: 400,
        gap: 85,
        maxYPos: -150,
        dx: 2,

        draw: function() {
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                let topYPos = p.y;
                let bottomYPos = p.y + this.h + this.gap;

                // Top pipe
                ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

                // Bottom pipe
                ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
            }
        },

        update: function() {
            if (state.current !== state.game) return;

            if (frames % 100 === 0) {
                this.position.push({
                    x: cvs.width,
                    y: this.maxYPos * (Math.random() + 1)
                });
            }
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];

                p.x -= this.dx;

                if (p.x + this.w <= 0) {
                    this.position.shift();
                    score.value += 1;
                    SCORE_S.play();
                    score.best = Math.max(score.value, score.best);
                    localStorage.setItem("best", score.best.toString());
                }

                // Collision detection
                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h ||
                    bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y + this.h + this.gap && bird.y - bird.radius < p.y + this.h + this.gap + this.h) {
                    state.current = state.over;
                    HIT.play();
                }
            }
        },

        reset: function() {
            this.position = [];
        }
    };

    // Score
    const score = {
        best: parseInt(localStorage.getItem("best")) || 0,
        value: 0,

        draw: function() {
            ctx.fillStyle = "#FFF";
            ctx.strokeStyle = "#000";

            if (state.current === state.game) {
                ctx.font = "35px Teko";
                ctx.fillText(this.value, cvs.width / 2, 50);
                ctx.strokeText(this.value, cvs.width / 2, 50);
            } else if (state.current === state.over) {
                ctx.font = "25px Teko";
                ctx.fillText(this.value, 225, 186);
                ctx.strokeText(this.value, 225, 186);
                // Best score
                ctx.fillText(this.best, 225, 228);
                ctx.strokeText(this.best, 225, 228);
            }
        },

        reset: function() {
            this.value = 0;
        }
    };

    // Draw Function
    function draw() {
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

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
        bird.update();
        fg.update();
        pipes.update();
    }

    // Loop Function
    function loop() {
        update();
        draw();
        frames++;
        requestAnimationFrame(loop);
    }

    sprite.onload = loop;
};
