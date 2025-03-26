document.addEventListener('DOMContentLoaded', async () => {
    const difficultySelect = document.getElementById('difficulty-select');
    const gameCanvas = document.getElementById('game-canvas');
    const controlsDiv = document.querySelector('.controls');
    
    // Initialize pose detector
    const poseDetector = new PoseDetector();
    const setupSuccess = await poseDetector.setup();
    
    if (!setupSuccess) {
        alert("Failed to set up pose detection. Please make sure your camera is connected and you've granted permission.");
        return;
    }
    
    // Initialize game
    const game = new DinoGame(gameCanvas);
    
    // Set difficulty from select (default to medium)
    game.currentDifficulty = parseInt(difficultySelect.value || "1");
    
    // Set up game loop
    let lastTime = 0;
    const gameLoop = (timestamp) => {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Always update the game with the current pose state, even when game over
        game.update(poseDetector.humanState);
        game.draw();
        
        // Update action display even when game is over
        if (game.gameOver) {
            document.getElementById('action').textContent = `Action: ${poseDetector.humanState}`;
        }
        
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
                    
                    // Hide controls
                    controlsDiv.style.display = 'none';
                }, 500);
            }
        }, 1000);
    };
    
    // Start pose detection immediately
    poseDetector.startDetection((state) => {
        console.log("Pose state changed:", state);
    });
    
    // Set the onCalibrationComplete callback
    poseDetector.onCalibrationComplete = startGameWithCountdown;
}); 