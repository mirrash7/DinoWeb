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
        this.isPaused = false;
        this.showFPS = false;
        this.lastFrameTime = 0;
        this.frameRate = 0;
        
        // Performance adjustments
        this.tempSpeedAdjust = 1;
        this.enableClouds = true;
        this.reducedEffects = false;
        this.obstacleFrequencyMultiplier = 1;
        
        // Game version
        this.version = "1.1";
        
        // Visual style settings
        this.colors = {
            sky: '#f7f7f7',
            ground: '#e7e7e7',
            groundLine: '#c7c7c7',
            scoreText: '#535353',
            versionText: '#999999',
            shadow: 'rgba(0, 0, 0, 0.1)',
            gameOverGradient1: '#8B4513', // SaddleBrown
            gameOverGradient2: '#DAA520', // GoldenRod
            gameOverText: '#FFFFFF',      // White
            gameOverShadow: 'rgba(0, 0, 0, 0.5)',
            gameOverGlow: 'rgba(255, 215, 0, 0.7)' // Gold glow
        };
        
        // Player profile
        this.playerProfile = {
            acronym: '---',
            country: '--'
        };
        
        // Load assets
        this.loadAssets();
        
        // Adjust performance settings based on device capabilities
        this.adjustPerformanceSettings();
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
        
        // Update hidden display elements (still needed for game logic)
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('action').textContent = 'Action: standing';
        
        console.log("Game reset!");
    }
    
    update(action) {
        // Don't update if paused
        if (this.isPaused) return;
        
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
        
        // Update ground
        this.ground.update(this.gameSpeed);
        
        // Skip cloud generation on low-power devices
        if (this.enableClouds) {
            this.cloudTimer++;
            if (this.cloudTimer > 50) {
                this.clouds.push(new Cloud(this));
                this.cloudTimer = 0;
            }
            
            for (let i = this.clouds.length - 1; i >= 0; i--) {
                this.clouds[i].update(this.gameSpeed);
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
            this.obstacles[i].update(this.gameSpeed);
            
            // Check collision
            if (this.isColliding(this.dino, this.obstacles[i])) {
                this.gameOver = true;
            }
            
            if (this.obstacles[i].x < -100) {
                this.obstacles.splice(i, 1);
            }
        }
        
        // Increase score
        this.score++;
        
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
    }
    
    draw() {
        // Calculate FPS
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.frameRate = Math.round(1000 / delta);
        
        // Clear and draw background gradient
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw sky
        this.ctx.fillStyle = this.colors.sky;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw a subtle horizon line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.GROUND_HEIGHT - 5);
        this.ctx.lineTo(this.width, this.GROUND_HEIGHT - 5);
        this.ctx.strokeStyle = this.colors.groundLine;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw clouds if enabled
        if (this.enableClouds) {
            this.clouds.forEach(cloud => cloud.draw());
        }
        
        // Draw ground with a subtle gradient
        this.ground.draw();
        
        // Draw score in top right corner
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Score: ${this.score}`, this.width - 20, 40);
        
        // Draw player profile in top left
        this.ctx.textAlign = 'left';
        const countryFlag = this.getCountryFlag(this.playerProfile.country);
        this.ctx.fillText(`${countryFlag} ${this.playerProfile.acronym}`, 20, 40);
        this.ctx.textAlign = 'left';
        
        // Draw obstacles with shadows
        this.obstacles.forEach(obstacle => {
            // Draw shadow
            this.ctx.fillStyle = this.colors.shadow;
            this.ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.rect.height - 5, 
                             obstacle.rect.width, 5);
            obstacle.draw();
        });
        
        // Draw dino with shadow
        this.ctx.fillStyle = this.colors.shadow;
        if (this.dino.isDucking) {
            this.ctx.fillRect(this.dino.x + 5, this.dino.duckY + 35, 70, 5);
        } else {
            this.ctx.fillRect(this.dino.x + 5, this.dino.y + 65, 50, 5);
        }
        this.dino.draw();
        
        // Draw version number and game info on the same line with background
        // First draw a background rectangle for the info line
        this.ctx.fillStyle = this.colors.sky;
        this.ctx.fillRect(0, this.height - 20, this.width, 20);
        
        // Add a subtle separator line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 20);
        this.ctx.lineTo(this.width, this.height - 20);
        this.ctx.strokeStyle = this.colors.groundLine;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Now draw the text
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = this.colors.versionText;
        
        // Version on left
        this.ctx.fillText(`v${this.version}`, 10, this.height - 10);
        
        // Difficulty and action info (no score here anymore)
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Difficulty: ${['Easy', 'Medium', 'Hard'][this.currentDifficulty]} | Action: ${this.lastAction}`, 
                         this.width - 10, this.height - 10);
        
        // Reset text alignment
        this.ctx.textAlign = 'left';
        
        // Draw game over message with 3D styling
        if (this.gameOver) {
            // Darken the entire screen with a semi-transparent overlay
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Create 3D-looking panel with gradient
            const panelWidth = 480;
            const panelHeight = 200;
            const panelX = this.width/2 - panelWidth/2;
            const panelY = this.height/2 - panelHeight/2;
            
            // Create gradient for 3D effect - gold to brown
            const gradient = this.ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
            gradient.addColorStop(0, this.colors.gameOverGradient2); // GoldenRod at top
            gradient.addColorStop(1, this.colors.gameOverGradient1); // SaddleBrown at bottom
            
            // Draw main panel with rounded corners
            this.ctx.save();
            this.roundRect(panelX, panelY, panelWidth, panelHeight, 15);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Add gold bevel effect
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)'; // Gold bevel
            this.ctx.lineWidth = 2;
            this.roundRect(panelX + 3, panelY + 3, panelWidth - 6, panelHeight - 6, 12);
            this.ctx.stroke();
            
            // Add shadow
            this.ctx.shadowColor = this.colors.gameOverShadow;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 5;
            this.ctx.shadowOffsetY = 5;
            this.roundRect(panelX, panelY, panelWidth, panelHeight, 15);
            this.ctx.stroke();
            this.ctx.shadowColor = 'transparent';
            
            // Draw "GAME OVER" text with 3D effect - centered
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 36px Arial';
            
            // Text shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillText('GAME OVER', panelX + panelWidth/2 + 2, panelY + 50 + 2);
            
            // Main text with gold glow
            this.ctx.fillStyle = this.colors.gameOverText;
            this.ctx.shadowColor = this.colors.gameOverGlow;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.fillText('GAME OVER', panelX + panelWidth/2, panelY + 50);
            this.ctx.shadowColor = 'transparent';
            
            // Draw score with gold glow - centered
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.shadowColor = this.colors.gameOverGlow;
            this.ctx.shadowBlur = 10;
            this.ctx.fillText(`Final Score: ${this.score}`, panelX + panelWidth/2, panelY + 90);
            this.ctx.shadowColor = 'transparent';
            
            // Draw restart instructions - centered
            this.ctx.font = '18px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.fillText('Press R to restart', panelX + panelWidth/2, panelY + 130);
            this.ctx.fillText('Press D to cycle difficulty', panelX + panelWidth/2, panelY + 160);
            this.ctx.fillText('Raise your hand above the red line to restart', panelX + panelWidth/2, panelY + 190);
            
            // Reset text alignment
            this.ctx.textAlign = 'left';
            this.ctx.restore();
        }
        
        // Draw FPS counter if enabled
        if (this.showFPS) {
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`FPS: ${this.frameRate}`, 10, 20);
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
    
    adjustPerformanceSettings() {
        // Check if device is likely to have performance issues
        const isLowPowerDevice = navigator.hardwareConcurrency <= 4 || 
                                /Intel(R) HD Graphics/.test(navigator.userAgent);
        
        if (isLowPowerDevice) {
            // Reduce visual effects
            this.enableClouds = false;
            this.reducedEffects = true;
            
            // Reduce obstacle frequency
            this.obstacleFrequencyMultiplier = 0.7;
            
            console.log("Performance mode enabled for low-power device");
        }
    }
    
    // Add helper method for drawing rounded rectangles
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
    
    // Add helper method to get country flag emoji
    getCountryFlag(countryCode) {
        if (!countryCode || countryCode === '--') return '🏳️';
        
        // Convert country code to flag emoji (each letter is converted to a regional indicator symbol emoji)
        return countryCode
            .toUpperCase()
            .split('')
            .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            .join('');
    }
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
        // Draw ground with a subtle gradient
        const gradient = this.game.ctx.createLinearGradient(0, this.y, 0, this.y + 20);
        gradient.addColorStop(0, this.game.colors.ground);
        gradient.addColorStop(1, this.game.colors.groundLine);
        
        this.game.ctx.fillStyle = gradient;
        this.game.ctx.fillRect(0, this.y, this.game.width, 50);
        
        // Draw ground texture
        this.game.ctx.drawImage(this.game.groundImg, this.x1, this.y, this.game.width, 20);
        this.game.ctx.drawImage(this.game.groundImg, this.x2, this.y, this.game.width, 20);
    }
}
// Similar implementations for Obstacle, Cloud, and Ground classes 
