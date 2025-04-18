class TutorialPanel {
    constructor(game) {
        this.game = game;
        this.isVisible = false;
        this.currentStep = 0;
        
        // Tutorial steps with images and text
        this.tutorialSteps = [
            
            {
                title: "Stand in Frame",
                text: "Make sure your upper body is visible in the webcam. Stand about 3-6 feet away from the camera.",
                image: "tutorial/stand.png"
            },
            {
                title: "Calibrate the Game",
                text: "Raise one arm up above your shoulders and hold to calibrate the game.",
                image: "tutorial/arm.png"
            },
            {
                title: "Jump Action",
                text: "To make the dinosaur jump, jump with your shoulders above the yellow line.",
                image: "tutorial/jump.png"
            },
            {
                title: "Big Jump",
                text: "For a higher jump, jump with your shoulders above the red line.",
                image: "tutorial/big-jump.png"
            },
            {
                title: "Duck Action",
                text: "To make the dinosaur duck, crouch down or bend your knees.",
                image: "tutorial/duck.png"
            },
            {
                title: "Skip High Score Entry",
                text: "If you achieve a high score but don't want to enter your details, raise both hands above the red line to skip the entry form.",
                image: "tutorial/skip-highscore.png"
            }
        ];
        
        this.createPanel();
        this.createToggleButton();
    }
    
    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'tutorial-panel';
        this.panel.className = 'tutorial-panel';
        this.panel.style.display = 'none';
        
        // Create panel header
        const header = document.createElement('div');
        header.className = 'tutorial-header';
        
        const title = document.createElement('h2');
        title.textContent = 'How to Play';
        title.id = 'tutorial-title';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'close-btn';
        closeBtn.addEventListener('click', () => this.toggle());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create content container
        this.content = document.createElement('div');
        this.content.className = 'tutorial-content';
        
        // Create navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'tutorial-nav-buttons';
        
        this.prevButton = document.createElement('button');
        this.prevButton.textContent = '← Previous';
        this.prevButton.className = 'tutorial-nav-btn prev-btn';
        this.prevButton.addEventListener('click', () => this.prevStep());
        this.prevButton.disabled = true;
        
        this.nextButton = document.createElement('button');
        this.nextButton.textContent = 'Next →';
        this.nextButton.className = 'tutorial-nav-btn next-btn';
        this.nextButton.addEventListener('click', () => this.nextStep());
        
        navButtons.appendChild(this.prevButton);
        navButtons.appendChild(this.nextButton);
        
        // Create step indicator
        this.stepIndicator = document.createElement('div');
        this.stepIndicator.className = 'step-indicator';
        this.updateStepIndicator();
        
        // Assemble panel
        this.panel.appendChild(header);
        this.panel.appendChild(this.content);
        this.panel.appendChild(this.stepIndicator);
        this.panel.appendChild(navButtons);
        
        // Add to game section
        document.querySelector('.game-section').appendChild(this.panel);
        
        // Load the first step
        this.showStep(0);
    }
    
    createToggleButton() {
        // Create the tutorial button for the game screen
        const gameToggleBtn = document.createElement('button');
        gameToggleBtn.id = 'tutorial-toggle';
        gameToggleBtn.textContent = 'Tutorial';
        gameToggleBtn.title = 'How to Play';
        gameToggleBtn.addEventListener('click', () => this.toggle());
        
        // Position it next to the settings button
        const settingsBtn = document.getElementById('settings-toggle');
        if (settingsBtn) {
            settingsBtn.parentNode.insertBefore(gameToggleBtn, settingsBtn);
        } else {
            document.querySelector('.game-section').appendChild(gameToggleBtn);
        }
        
        // Create a tutorial button for the initial profile screen
        const profileScreen = document.getElementById('profile-screen');
        if (profileScreen) {
            const startButton = profileScreen.querySelector('.start-button');
            if (startButton) {
                const profileTutorialBtn = document.createElement('button');
                profileTutorialBtn.className = 'tutorial-button';
                profileTutorialBtn.textContent = 'Tutorial';
                profileTutorialBtn.addEventListener('click', () => this.toggle());
                
                // Insert before the start button
                startButton.parentNode.insertBefore(profileTutorialBtn, startButton);
            }
        }
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.style.display = this.isVisible ? 'flex' : 'none';
        
        // Pause the game when tutorial is open
        if (this.isVisible) {
            if (this.game && this.game.isRunning) {
                this.wasRunning = true;
                this.game.isRunning = false;
            }
        } else {
            // Resume the game if it was running before
            if (this.game && this.wasRunning) {
                this.game.isRunning = true;
                this.wasRunning = false;
            }
        }
    }
    
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) return;
        
        const step = this.tutorialSteps[stepIndex];
        this.currentStep = stepIndex;
        
        // Clear previous content
        this.content.innerHTML = '';
        
        // Create step content
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = step.title;
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'tutorial-image-container';
        
        const stepImage = document.createElement('img');
        stepImage.src = step.image;
        stepImage.alt = step.title;
        stepImage.className = 'tutorial-image';
        
        // Add image to container
        imageContainer.appendChild(stepImage);
        
        const stepText = document.createElement('p');
        stepText.textContent = step.text;
        
        // Add content to panel
        this.content.appendChild(stepTitle);
        this.content.appendChild(imageContainer);
        this.content.appendChild(stepText);
        
        // Update navigation buttons
        this.prevButton.disabled = stepIndex === 0;
        this.nextButton.textContent = stepIndex === this.tutorialSteps.length - 1 ? 'Finish' : 'Next →';
        
        // Update step indicator
        this.updateStepIndicator();
    }
    
    nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            // Last step, close the tutorial
            this.toggle();
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    updateStepIndicator() {
        this.stepIndicator.innerHTML = '';
        
        for (let i = 0; i < this.tutorialSteps.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'step-dot';
            if (i === this.currentStep) {
                dot.classList.add('active');
            }
            this.stepIndicator.appendChild(dot);
        }
    }
}

// Initialize the tutorial panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the game to be initialized
    const initTutorial = () => {
        if (window.game) {
            window.tutorialPanel = new TutorialPanel(window.game);
        } else {
            setTimeout(initTutorial, 100);
        }
    };
    
    initTutorial();
}); 