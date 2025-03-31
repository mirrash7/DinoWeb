document.addEventListener('DOMContentLoaded', async () => {
    // Hide calibration screen initially
    document.getElementById('calibration').style.display = 'none';
    
    // Initialize pose detector in the background
    const poseDetector = new PoseDetector();
    let setupSuccess = false;
    
    // Start pose detector setup in the background
    const setupPromise = poseDetector.setup().then(success => {
        setupSuccess = success;
        if (!success) {
            alert("Failed to set up pose detection. Please make sure your camera is connected and you've granted permission.");
        }
        return success;
    });
    
    // Initialize game
    const gameCanvas = document.getElementById('game-canvas');
    const game = new DinoGame(gameCanvas);
    
    // Initialize settings panel and make it globally accessible
    window.settingsPanel = new SettingsPanel(game);
    
    // Wait for profile completion
    document.addEventListener('profileComplete', async (event) => {
        // Store profile data in game
        game.playerProfile = event.detail;
        console.log('Profile complete:', game.playerProfile);
        
        // Set difficulty from profile
        game.currentDifficulty = event.detail.difficulty;
        
        // Make sure pose detection is ready
        if (!setupSuccess) {
            // Wait for setup to complete
            setupSuccess = await setupPromise;
            if (!setupSuccess) return;
        }
        
        // Set the onCalibrationComplete callback
        poseDetector.onCalibrationComplete = startGameWithCountdown;
        
        // Start pose detection
        poseDetector.startDetection((state) => {
            console.log("Pose state changed:", state);
        });
    });
    
    // Set up game loop
    let lastTime = 0;
    const gameLoop = (timestamp) => {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Skip frames if running too slow (below 30fps)
        if (deltaTime > 33 && !game.gameOver) { // 33ms = ~30fps
            // Skip cloud generation on slow frames
            game.enableClouds = false;
        } else {
            // Only re-enable clouds if they weren't disabled by performance settings
            if (!game.reducedEffects) {
                game.enableClouds = true;
            }
        }
        
        // Update and draw
        game.update(poseDetector.humanState);
        game.draw();
        
        requestAnimationFrame(gameLoop);
    };
    
    // Function to start the game after calibration
    const startGameWithCountdown = () => {
        // Update difficulty display
        document.getElementById('difficulty').textContent = 
            `Difficulty: ${['Easy', 'Medium', 'Hard'][game.currentDifficulty]}`;
        
        // Create countdown element
        const countdownEl = document.createElement('div');
        countdownEl.className = 'countdown';
        countdownEl.style.position = 'absolute';
        countdownEl.style.top = '50%';
        countdownEl.style.left = '50%';
        countdownEl.style.transform = 'translate(-50%, -50%)';
        countdownEl.style.fontSize = '72px';
        countdownEl.style.fontWeight = 'bold';
        countdownEl.style.color = '#333';
        countdownEl.style.zIndex = '100';
        document.getElementById('game').appendChild(countdownEl);
        
        // Start countdown
        let count = 3;
        countdownEl.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = count;
            } else {
                clearInterval(countdownInterval);
                countdownEl.textContent = 'GO!';
                
                // Remove countdown after a short delay
                setTimeout(() => {
                    countdownEl.remove();
                    
                    // Initialize game
                    game.init();
                    
                    // Pass game instance to pose detector for restart functionality
                    poseDetector.game = game;
                    
                    // Start game loop
                    requestAnimationFrame(gameLoop);
                }, 500);
            }
        }, 1000);
    };

    // At the beginning of your code
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowPowerDevice = isMobile || navigator.hardwareConcurrency <= 4;

    // If low power device, adjust game settings
    if (isLowPowerDevice) {
        // Reduce visual effects
        game.enableClouds = false;
        game.reducedEffects = true;
        
    }

    // Add this to the beginning of the DOMContentLoaded event handler
    const resizeGameCanvas = () => {
        const gameSection = document.querySelector('.game-section');
        const gameCanvas = document.getElementById('game-canvas');
        
        // Set canvas dimensions to match container
        gameCanvas.width = gameSection.clientWidth;
        gameCanvas.height = gameSection.clientHeight;
        
        // Update game dimensions if game is initialized
        if (game) {
            game.width = gameCanvas.width;
            game.height = gameCanvas.height;
            game.GROUND_HEIGHT = gameCanvas.height - 50;
        }
    };

    // Call on load and window resize
    resizeGameCanvas();
    window.addEventListener('resize', resizeGameCanvas);
}); 
