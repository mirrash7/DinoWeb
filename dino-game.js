class DinoGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game constants
        this.GROUND_HEIGHT = 350;
        this.FPS = 60;
        
        // Difficulty settings
        this.DIFFICULTY_EASY = 0;
        this.DIFFICULTY_MEDIUM = 1;
        this.DIFFICULTY_HARD = 2;
        this.currentDifficulty = this.DIFFICULTY_MEDIUM;
        
        // Obstacle types
        this.SMALL_CACTUS = 0;
        this.TALL_CACTUS = 1;
        this.LOW_BIRD = 2;
        this.MID_BIRD = 3;
        
        // Game state
        this.dino = null;
        this.ground = null;
        this.obstacles = [];
        this.clouds = [];
        this.score = 0;
        this.gameSpeed = 7;
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        this.gameOver = false;
        this.lastAction = "standing";
        
        // Performance adjustments
        this.tempSpeedAdjust = 1;
        this.enableClouds = true;
        this.reducedEffects = false;
        this.obstacleFrequencyMultiplier = 1;
        
        // Load assets
        this.loadAssets();
    }
    
    async loadAssets() {
        // Show loading status
        document.getElementById('loading-status').textContent = "Loading game assets...";
        
        // Load all game images
        this.dinoRunImgs = [
            await this.loadImage('assets/dino_run1.png'),
            await this.loadImage('assets/dino_run2.png')
        ];
        this.dinoJumpImg = await this.loadImage('assets/dino_jump.png');
        this.dinoDuckImgs = [
            await this.loadImage('assets/dino_duck1.png'),
            await this.loadImage('assets/dino_duck2.png')
        ];
        this.cactusImgs = [
            await this.loadImage('assets/cactus_small.png'),
            await this.loadImage('assets/cactus_big.png')
        ];
        this.tallCactusImg = await this.loadImage('assets/cactus_big.png');
        this.birdImgs = [
            await this.loadImage('assets/bird1.png'),
            await this.loadImage('assets/bird2.png')
        ];
        this.cloudImg = await this.loadImage('assets/cloud.png');
        this.groundImg = await this.loadImage('assets/ground.png');
        
        // Hide loading status when done
        document.getElementById('loading-status').textContent = "";
    }
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    init() {
        // Initialize game objects
        this.dino = new Dino(this);
        this.ground = new Ground(this);
        this.obstacles = [];
        this.clouds = [];
        this.score = 0;
        
        // Set initial game speed based on difficulty
        if (this.currentDifficulty === this.DIFFICULTY_EASY) {
            this.gameSpeed = 5;
        } else if (this.currentDifficulty === this.DIFFICULTY_MEDIUM) {
            this.gameSpeed = 7;
        } else {
            this.gameSpeed = 10;
        }
        
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        this.gameOver = false;
        
        // Create initial clouds
        for (let i = 0; i < 3; i++) {
            this.clouds.push(new Cloud(this));
        }
        
        // Set up keyboard controls
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.gameOver && this.dino.canJump) {
                if (event.shiftKey) {
                    this.dino.velY = this.dino.bigJumpVel;
                    this.lastAction = "big jump";
                } else {
                    this.dino.velY = this.dino.jumpVel;
                    this.lastAction = "small jump";
                }
                this.dino.isJumping = true;
                this.dino.isDucking = false;
                this.dino.canJump = false;
            }
            
            if (event.code === 'ArrowDown' && !this.gameOver) {
                this.dino.isDucking = true;
                this.lastAction = "duck";
            }
            
            if (event.code === 'KeyR' && this.gameOver) {
                this.reset();
            }
            
            if (event.code === 'KeyD' && this.gameOver) {
                this.currentDifficulty = (this.currentDifficulty + 1) % 3;
                document.getElementById('difficulty').textContent = 
                    `Difficulty: ${['Easy', 'Medium', 'Hard'][this.currentDifficulty]}`;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowDown') {
                this.dino.isDucking = false;
                this.lastAction = "standing";
            }
        });
    }
    
    reset() {
        // Reset game state
        this.gameOver = false;
        this.score = 0;
        
        // Set game speed based on difficulty
        if (this.currentDifficulty === this.DIFFICULTY_EASY) {
            this.gameSpeed = 5;
        } else if (this.currentDifficulty === this.DIFFICULTY_MEDIUM) {
            this.gameSpeed = 7;
        } else {
            this.gameSpeed = 10;
        }
        
        // Reset game objects
        this.dino = new Dino(this);
        this.ground = new Ground(this);
        this.obstacles = [];
        this.clouds = [];
        
        // Create initial clouds
        for (let i = 0; i < 3; i++) {
            this.clouds.push(new Cloud(this));
        }
        
        // Reset timers
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        
        // Update display
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('action').textContent = 'Action: standing';
        
        console.log("Game reset!");
    }
    
    update(action) {
        // Process pose action even when game is over (for restart detection)
        if (action) {
            // Store the action for display
            if (action !== "standing" || this.lastAction === "standing") {
                this.lastAction = action;
            }
            
            // Only update dino if game is not over
            if (!this.gameOver) {
                this.dino.updateFromAction(action);
                
                // Reset lastAction to standing when landing from a jump
                if (this.dino.justLanded) {
                    this.lastAction = "standing";
                }
                
                // Also reset to standing if not jumping or ducking
                if (!this.dino.isJumping && !this.dino.isDucking && action === "standing") {
                    this.lastAction = "standing";
                }
            }
        }
        
        // Don't update game elements if game is over
        if (this.gameOver) return;
        
        // Apply speed adjustment for performance
        const effectiveSpeed = this.gameSpeed * this.tempSpeedAdjust;
        
        // Update ground with adjusted speed
        this.ground.update(effectiveSpeed);
        
        // Skip cloud generation on low-power devices
        if (this.enableClouds) {
            this.cloudTimer++;
            if (this.cloudTimer > 50) {
                this.clouds.push(new Cloud(this));
                this.cloudTimer = 0;
            }
            
            for (let i = this.clouds.length - 1; i >= 0; i--) {
                this.clouds[i].update(effectiveSpeed);
                if (this.clouds[i].x < -100) {
                    this.clouds.splice(i, 1);
                }
            }
        }
        
        // Update obstacles with adjusted frequency and speed
        this.obstacleTimer++;
        
        // Adjust obstacle spawn rate based on difficulty and device performance
        let spawnThreshold;
        if (this.currentDifficulty === this.DIFFICULTY_EASY) {
            spawnThreshold = 120;
        } else if (this.currentDifficulty === this.DIFFICULTY_MEDIUM) {
            spawnThreshold = 80;
        } else {
            spawnThreshold = 50;
        }
        
        // Apply performance multiplier to spawn rate
        spawnThreshold = spawnThreshold / this.obstacleFrequencyMultiplier;
        
        if (this.obstacleTimer > spawnThreshold + Math.floor(Math.random() * 50)) {
            // Determine obstacle type
            const typeIdx = Math.floor(Math.random() * 4);
            this.obstacles.push(new Obstacle(this, this.width, typeIdx));
            this.obstacleTimer = 0;
        }
        
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(effectiveSpeed);
            
            // Check collision
            if (this.isColliding(this.dino, this.obstacles[i])) {
                this.gameOver = true;
            }
            
            if (this.obstacles[i].x < -100) {
                this.obstacles.splice(i, 1);
            }
        }
        
        // Increase score and speed
        this.score++;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        
        // Speed increases based on difficulty
        if (this.currentDifficulty === this.DIFFICULTY_EASY) {
            if (this.score % 1500 === 0) {
                this.gameSpeed += 1;
            }
        } else if (this.currentDifficulty === this.DIFFICULTY_MEDIUM) {
            if (this.score % 800 === 0) {
                this.gameSpeed += 1;
            }
        } else {
            if (this.score % 500 === 0) {
                this.gameSpeed += 1;
            }
        }
        
        // Update action display
        document.getElementById('action').textContent = `Action: ${this.lastAction}`;
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw clouds if enabled
        if (this.enableClouds) {
            this.clouds.forEach(cloud => cloud.draw());
        }
        
        // Draw ground
        this.ground.draw();
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw());
        
        // Draw dino
        this.dino.draw();
        
        // Draw game over message
        if (this.gameOver) {
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('Game Over! Press R to restart', this.width / 2 - 150, this.height / 2);
            this.ctx.fillText('Press D to cycle difficulty', this.width / 2 - 150, this.height / 2 + 30);
            this.ctx.fillText('Or raise your hand above the red line to restart', this.width / 2 - 200, this.height / 2 + 60);
        }
    }
    
    isColliding(dino, obstacle) {
        return dino.rect.x < obstacle.rect.x + obstacle.rect.width &&
               dino.rect.x + dino.rect.width > obstacle.rect.x &&
               dino.rect.y < obstacle.rect.y + obstacle.rect.height &&
               dino.rect.y + dino.rect.height > obstacle.rect.y;
    }
    
    // Game classes
    // These would be defined here or in separate files
}

// Define game classes (Dino, Obstacle, Cloud, Ground)
class Dino {
    constructor(game) {
        this.game = game;
        this.x = 80;
        this.y = game.GROUND_HEIGHT - 70;
        this.duckY = game.GROUND_HEIGHT - 40;
        this.velY = 0;
        this.gravity = 1;
        this.jumpVel = -18;
        this.bigJumpVel = -22;
        this.isJumping = false;
        this.isDucking = false;
        this.runCount = 0;
        this.duckCount = 0;
        this.rect = { x: this.x, y: this.y, width: 50, height: 70 };
        this.duckRect = { x: this.x, y: this.duckY, width: 70, height: 40 };
        this.canJump = true;
        this.justLanded = false;
        this.jumpStartTime = 0;
        this.jumpUpgraded = false;
    }
    
    updateFromAction(action) {
        if (action === "small jump" && !this.isJumping && this.canJump) {
            this.velY = this.jumpVel;
            this.isJumping = true;
            this.isDucking = false;
            this.canJump = false;
            this.jumpStartTime = Date.now();
            this.jumpUpgraded = false;
        } else if (action === "big jump") {
            if (!this.isJumping && this.canJump) {
                this.velY = this.bigJumpVel;
                this.isJumping = true;
                this.isDucking = false;
                this.canJump = false;
                this.jumpUpgraded = true;
            } else if (this.isJumping && !this.jumpUpgraded && this.velY < 0) {
                this.velY = this.bigJumpVel;
                this.jumpUpgraded = true;
            }
        } else if (action === "duck" && !this.isJumping) {
            this.isDucking = true;
        } else if (action !== "duck") {
            this.isDucking = false;
        }
        
        this.update();
    }
    
    update() {
        if (this.isJumping) {
            this.y += this.velY;
            this.velY += this.gravity;
            
            if (this.y >= this.game.GROUND_HEIGHT - 70) {
                this.y = this.game.GROUND_HEIGHT - 70;
                this.isJumping = false;
                this.velY = 0;
                this.canJump = true;
                this.justLanded = true;
            }
        } else {
            this.justLanded = false;
        }
        
        if (this.isDucking) {
            this.rect = this.duckRect;
            this.rect.y = this.duckY;
        } else {
            this.rect = { x: this.x, y: this.y, width: 50, height: 70 };
        }
    }
    
    draw() {
        if (this.isJumping) {
            this.game.ctx.drawImage(this.game.dinoJumpImg, this.x, this.y, 60, 70);
        } else if (this.isDucking) {
            const duckImg = this.game.dinoDuckImgs[Math.floor(this.duckCount / 5) % 2];
            this.game.ctx.drawImage(duckImg, this.x, this.duckY, 80, 40);
            this.duckCount = (this.duckCount + 1) % 10;
        } else {
            const runImg = this.game.dinoRunImgs[Math.floor(this.runCount / 5) % 2];
            this.game.ctx.drawImage(runImg, this.x, this.y, 60, 70);
            this.runCount = (this.runCount + 1) % 10;
        }
    }
}

// Add these classes to dino-game.js
class Obstacle {
    constructor(game, x, typeIdx) {
        this.game = game;
        this.x = x;
        this.typeIdx = typeIdx;
        
        if (typeIdx === game.SMALL_CACTUS) {
            this.y = game.GROUND_HEIGHT - 70;
            this.image = game.cactusImgs[0];
            this.rect = { x: x, y: this.y, width: 40, height: 70 };
        } else if (typeIdx === game.TALL_CACTUS) {
            this.y = game.GROUND_HEIGHT - 120;
            this.image = game.tallCactusImg;
            this.rect = { x: x, y: this.y, width: 40, height: 120 };
        } else if (typeIdx === game.LOW_BIRD) {
            this.y = game.GROUND_HEIGHT - 50;
            this.birdCount = 0;
            this.rect = { x: x, y: this.y, width: 50, height: 40 };
        } else if (typeIdx === game.MID_BIRD) {
            this.y = game.GROUND_HEIGHT - 100;
            this.birdCount = 0;
            this.rect = { x: x, y: this.y, width: 50, height: 40 };
        }
    }
    
    update(gameSpeed) {
        this.x -= gameSpeed || this.game.gameSpeed;
        this.rect.x = this.x;
    }
    
    draw() {
        if (this.typeIdx === this.game.SMALL_CACTUS || this.typeIdx === this.game.TALL_CACTUS) {
            this.game.ctx.drawImage(this.image, this.x, this.y, this.rect.width, this.rect.height);
        } else {
            const birdImg = this.game.birdImgs[Math.floor(this.birdCount / 5) % 2];
            this.game.ctx.drawImage(birdImg, this.x, this.y, 60, 40);
            this.birdCount = (this.birdCount + 1) % 10;
        }
    }
}

class Cloud {
    constructor(game) {
        this.game = game;
        this.x = game.width + Math.random() * 300;
        this.y = Math.random() * 150 + 50;
    }
    
    update(gameSpeed) {
        this.x -= (gameSpeed || this.game.gameSpeed) / 2;
    }
    
    draw() {
        this.game.ctx.drawImage(this.game.cloudImg, this.x, this.y, 80, 40);
    }
}

class Ground {
    constructor(game) {
        this.game = game;
        this.x1 = 0;
        this.x2 = game.width;
        this.y = game.GROUND_HEIGHT;
    }
    
    update(gameSpeed) {
        this.x1 -= gameSpeed || this.game.gameSpeed;
        this.x2 -= gameSpeed || this.game.gameSpeed;
        
        if (this.x1 + this.game.width < 0) {
            this.x1 = this.x2 + this.game.width;
        }
        
        if (this.x2 + this.game.width < 0) {
            this.x2 = this.x1 + this.game.width;
        }
    }
    
    draw() {
        this.game.ctx.drawImage(this.game.groundImg, this.x1, this.y, this.game.width, 20);
        this.game.ctx.drawImage(this.game.groundImg, this.x2, this.y, this.game.width, 20);
    }
}
// Similar implementations for Obstacle, Cloud, and Ground classes 
