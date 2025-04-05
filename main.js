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
    
    // Make game globally accessible for settings panel
    window.game = game;
    
    // Initialize settings panel after game is created
    try {
        // Check if SettingsPanel class exists before trying to use it
        if (typeof SettingsPanel === 'function') {
            window.settingsPanel = new SettingsPanel(game);
            console.log("Settings panel initialized successfully");
        } else {
            console.error("SettingsPanel class is not defined. Make sure settings.js is loaded before main.js");
        }
    } catch (error) {
        console.error("Error initializing settings panel:", error);
    }
    
    // Initialize high score manager
    window.highScoreManager = new HighScoreManager();
    
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

    // Adjust webcam container size
    const adjustWebcamSize = () => {
        const gameContainer = document.querySelector('.game-container');
        const gameSection = document.querySelector('.game-section');
        const webcamContainer = document.getElementById('webcam-container');
        
        // Make container use flex layout and take full height
        gameContainer.style.display = 'flex';
        gameContainer.style.width = '100%';
        gameContainer.style.height = 'calc(100vh - 50px)'; // Full height minus header
        gameContainer.style.margin = '0 auto';
        gameContainer.style.padding = '0 10px 10px 10px';
        gameContainer.style.boxSizing = 'border-box';
        
        // Check if we're in landscape or portrait mode
        if (window.innerWidth > window.innerHeight) {
            // Landscape orientation - horizontal layout with 2:1 ratio
            gameContainer.style.flexDirection = 'row';
            gameContainer.style.gap = '20px';
            
            gameSection.style.flex = '2';  // 2/3 of the space
            webcamContainer.style.flex = '1';  // 1/3 of the space
        } else {
            // Portrait orientation - stack vertically
            gameContainer.style.flexDirection = 'column';
            gameContainer.style.gap = '10px';
            
            gameSection.style.flex = '1';
            gameSection.style.height = '50%';
            webcamContainer.style.flex = '1';
            webcamContainer.style.height = '50%';
        }
        
        // Set heights to 100% to fill container
        gameSection.style.height = '100%';
        webcamContainer.style.height = '100%';
        
        // Make video and canvas fill container
        const webcam = document.getElementById('webcam');
        const poseCanvas = document.getElementById('pose-canvas');
        
        webcam.style.width = '100%';
        webcam.style.height = '100%';
        webcam.style.objectFit = 'cover';
        
        poseCanvas.style.width = '100%';
        poseCanvas.style.height = '100%';
        poseCanvas.style.position = 'absolute';
        poseCanvas.style.top = '0';
        poseCanvas.style.left = '0';
        poseCanvas.style.zIndex = '2';
        
        // Also update the game canvas size
        resizeGameCanvas();
    };
    
    // Call immediately and on window resize
    adjustWebcamSize();
    window.addEventListener('resize', adjustWebcamSize);

    // Apply webcam opacity from settings if available
    const savedSettings = localStorage.getItem('dinoGameSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const webcam = document.getElementById('webcam');
        if (webcam && settings.hasOwnProperty('fullOpacityWebcam')) {
            webcam.style.opacity = settings.fullOpacityWebcam ? '0' : '0.7';
        } else {
            // Default opacity if setting doesn't exist
            webcam.style.opacity = '0.7';
        }
    } else {
        // Default opacity if no settings
        const webcam = document.getElementById('webcam');
        if (webcam) {
            webcam.style.opacity = '0.7';
        }
    }
}); 
