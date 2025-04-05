class UserProfileManager {
    constructor() {
        this.profileData = {
            difficulty: 1 // Default to Medium (0=Easy, 1=Medium, 2=Hard)
        };
        
        // Country list with flag emojis (will be used in high score prompt)
        this.countries = [
            { code: 'US', name: '🇺🇸 United States' },
            { code: 'GB', name: '🇬🇧 United Kingdom' },
            { code: 'CA', name: '🇨🇦 Canada' },
            { code: 'AU', name: '🇦🇺 Australia' },
            { code: 'DE', name: '🇩🇪 Germany' },
            { code: 'FR', name: '🇫🇷 France' },
            { code: 'JP', name: '🇯🇵 Japan' },
            { code: 'CN', name: '🇨🇳 China' },
            { code: 'IN', name: '🇮🇳 India' },
            { code: 'BR', name: '🇧🇷 Brazil' },
            { code: 'MX', name: '🇲🇽 Mexico' },
            { code: 'IT', name: '🇮🇹 Italy' },
            { code: 'ES', name: '🇪🇸 Spain' },
            { code: 'KR', name: '🇰🇷 South Korea' },
            { code: 'RU', name: '🇷🇺 Russia' },
            { code: 'ZA', name: '🇿🇦 South Africa' },
            { code: 'NG', name: '🇳🇬 Nigeria' },
            { code: 'AR', name: '🇦🇷 Argentina' },
            { code: 'SE', name: '🇸🇪 Sweden' },
            { code: 'NZ', name: '🇳🇿 New Zealand' }
        ];
        
        // Create and show the profile form
        this.createProfileForm();
        
        // Event listeners
        this.setupEventListeners();
    }
    
    createProfileForm() {
        // Create profile screen
        const profileScreen = document.createElement('div');
        profileScreen.id = 'profile-screen';
        profileScreen.className = 'screen';
        profileScreen.style.zIndex = '100'; // Ensure it's on top
        
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'profile-form-container';
        formContainer.style.backgroundColor = 'white';
        formContainer.style.padding = '30px';
        formContainer.style.borderRadius = '10px';
        formContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        formContainer.style.width = '80%';
        formContainer.style.maxWidth = '500px';
        
        // Create form title
        const title = document.createElement('h2');
        title.textContent = 'Game Settings';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.color = '#333';
        
        // Create form
        const form = document.createElement('form');
        form.id = 'profile-form';
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '20px';
        
        // Create difficulty selection
        const difficultyGroup = document.createElement('div');
        difficultyGroup.style.display = 'flex';
        difficultyGroup.style.flexDirection = 'column';
        difficultyGroup.style.gap = '5px';
        difficultyGroup.style.marginTop = '10px';
        
        const difficultyLabel = document.createElement('label');
        difficultyLabel.textContent = 'Select difficulty:';
        difficultyLabel.style.fontWeight = 'bold';
        
        const difficultyButtons = document.createElement('div');
        difficultyButtons.style.display = 'flex';
        difficultyButtons.style.justifyContent = 'space-between';
        difficultyButtons.style.gap = '10px';
        
        // Create the three difficulty buttons
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficultyBtns = [];
        
        difficulties.forEach((diff, index) => {
            const btn = document.createElement('button');
            btn.type = 'button'; // Important: not submit
            btn.textContent = diff;
            btn.dataset.difficulty = index;
            btn.style.flex = '1';
            btn.style.padding = '10px';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = index === 1 ? '#4CAF50' : '#e0e0e0';
            btn.style.color = index === 1 ? 'white' : '#333';
            btn.style.fontWeight = index === 1 ? 'bold' : 'normal';
            
            btn.addEventListener('click', () => {
                // Update selected difficulty
                this.profileData.difficulty = index;
                
                // Update button styles
                difficultyBtns.forEach((button, i) => {
                    button.style.backgroundColor = i === index ? '#4CAF50' : '#e0e0e0';
                    button.style.color = i === index ? 'white' : '#333';
                    button.style.fontWeight = i === index ? 'bold' : 'normal';
                });
            });
            
            difficultyBtns.push(btn);
            difficultyButtons.appendChild(btn);
        });
        
        difficultyGroup.appendChild(difficultyLabel);
        difficultyGroup.appendChild(difficultyButtons);
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'profile-submit';
        submitButton.textContent = 'Start Game';
        submitButton.style.padding = '12px';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.style.fontSize = '16px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.marginTop = '20px';
        
        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'profile-loading';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.marginTop = '20px';
        loadingIndicator.style.color = '#666';
        
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Game is loading in the background...';
        loadingText.style.margin = '5px 0';
        
        loadingIndicator.appendChild(loadingText);
        
        // Assemble form
        form.appendChild(difficultyGroup);
        form.appendChild(submitButton);
        
        // Assemble form container
        formContainer.appendChild(title);
        formContainer.appendChild(form);
        formContainer.appendChild(loadingIndicator);
        
        // Add to profile screen
        profileScreen.appendChild(formContainer);
        
        // Add to game section
        document.querySelector('.game-section').appendChild(profileScreen);
    }
    
    setupEventListeners() {
        const form = document.getElementById('profile-form');
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide profile screen
            document.getElementById('profile-screen').style.display = 'none';
            
            // Show calibration screen
            document.getElementById('calibration').style.display = 'flex';
            
            // Dispatch event that profile is complete
            const event = new CustomEvent('profileComplete', { 
                detail: this.profileData 
            });
            document.dispatchEvent(event);
        });
    }
    
    // Method to show high score prompt
    showHighScorePrompt(score, callback) {
        // Create high score prompt overlay
        const overlay = document.createElement('div');
        overlay.className = 'high-score-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        
        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.className = 'high-score-prompt';
        promptContainer.style.backgroundColor = 'white';
        promptContainer.style.padding = '30px';
        promptContainer.style.borderRadius = '10px';
        promptContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        promptContainer.style.width = '90%';
        promptContainer.style.maxWidth = '500px';
        promptContainer.style.textAlign = 'center';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'New High Score!';
        title.style.color = '#4CAF50';
        title.style.marginBottom = '10px';
        
        // Create score display
        const scoreDisplay = document.createElement('p');
        scoreDisplay.textContent = `Your score: ${score}`;
        scoreDisplay.style.fontSize = '24px';
        scoreDisplay.style.fontWeight = 'bold';
        scoreDisplay.style.marginBottom = '20px';
        
        // Create form
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '15px';
        
        // Create acronym input
        const acronymGroup = document.createElement('div');
        acronymGroup.style.display = 'flex';
        acronymGroup.style.flexDirection = 'column';
        acronymGroup.style.alignItems = 'flex-start';
        acronymGroup.style.gap = '5px';
        
        const acronymLabel = document.createElement('label');
        acronymLabel.htmlFor = 'high-score-acronym';
        acronymLabel.textContent = 'Enter your 3-letter acronym:';
        acronymLabel.style.fontWeight = 'bold';
        
        const acronymInput = document.createElement('input');
        acronymInput.type = 'text';
        acronymInput.id = 'high-score-acronym';
        acronymInput.maxLength = 3;
        acronymInput.placeholder = 'ABC';
        acronymInput.style.padding = '10px';
        acronymInput.style.fontSize = '16px';
        acronymInput.style.borderRadius = '5px';
        acronymInput.style.border = '1px solid #ccc';
        acronymInput.style.width = '100%';
        
        acronymGroup.appendChild(acronymLabel);
        acronymGroup.appendChild(acronymInput);
        
        // Create country select
        const countryGroup = document.createElement('div');
        countryGroup.style.display = 'flex';
        countryGroup.style.flexDirection = 'column';
        countryGroup.style.alignItems = 'flex-start';
        countryGroup.style.gap = '5px';
        
        const countryLabel = document.createElement('label');
        countryLabel.htmlFor = 'high-score-country';
        countryLabel.textContent = 'Select your country:';
        countryLabel.style.fontWeight = 'bold';
        
        const countrySelect = document.createElement('select');
        countrySelect.id = 'high-score-country';
        countrySelect.style.padding = '10px';
        countrySelect.style.fontSize = '16px';
        countrySelect.style.borderRadius = '5px';
        countrySelect.style.border = '1px solid #ccc';
        countrySelect.style.width = '100%';
        
        // Add placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '-- Select a country --';
        placeholderOption.selected = true;
        placeholderOption.disabled = true;
        countrySelect.appendChild(placeholderOption);
        
        // Add country options
        this.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
        
        countryGroup.appendChild(countryLabel);
        countryGroup.appendChild(countrySelect);
        
        // Create buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'space-between';
        buttonGroup.style.gap = '10px';
        buttonGroup.style.marginTop = '10px';
        
        const skipButton = document.createElement('button');
        skipButton.type = 'button';
        skipButton.textContent = 'Skip';
        skipButton.style.padding = '10px 20px';
        skipButton.style.backgroundColor = '#f0f0f0';
        skipButton.style.color = '#333';
        skipButton.style.border = 'none';
        skipButton.style.borderRadius = '5px';
        skipButton.style.fontSize = '16px';
        skipButton.style.cursor = 'pointer';
        skipButton.style.flex = '1';
        
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.textContent = 'Save Score';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.fontSize = '16px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.flex = '1';
        saveButton.disabled = true;
        
        buttonGroup.appendChild(skipButton);
        buttonGroup.appendChild(saveButton);
        
        // Assemble form
        form.appendChild(acronymGroup);
        form.appendChild(countryGroup);
        form.appendChild(buttonGroup);
        
        // Assemble prompt container
        promptContainer.appendChild(title);
        promptContainer.appendChild(scoreDisplay);
        promptContainer.appendChild(form);
        
        // Add to overlay
        overlay.appendChild(promptContainer);
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Set up validation
        const validateForm = () => {
            const isValid = acronymInput.value.length === 3 && countrySelect.value !== '';
            saveButton.disabled = !isValid;
            
            // Visual feedback
            if (acronymInput.value.length === 3) {
                acronymInput.style.borderColor = '#4CAF50';
            } else if (acronymInput.value.length > 0) {
                acronymInput.style.borderColor = '#ff9800';
            } else {
                acronymInput.style.borderColor = '#ccc';
            }
            
            if (countrySelect.value !== '') {
                countrySelect.style.borderColor = '#4CAF50';
            } else {
                countrySelect.style.borderColor = '#ccc';
            }
            
            return isValid;
        };
        
        // Set up event listeners
        acronymInput.addEventListener('input', () => {
            // Convert to uppercase
            acronymInput.value = acronymInput.value.toUpperCase();
            
            // Only allow letters
            acronymInput.value = acronymInput.value.replace(/[^A-Z]/g, '');
            
            validateForm();
        });
        
        countrySelect.addEventListener('change', validateForm);
        
        // Handle skip button
        skipButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (callback) callback(null);
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                const playerData = {
                    acronym: acronymInput.value,
                    country: countrySelect.value,
                    difficulty: this.profileData.difficulty
                };
                
                document.body.removeChild(overlay);
                if (callback) callback(playerData);
            }
        });
        
        // Focus the acronym input
        setTimeout(() => {
            acronymInput.focus();
        }, 100);
    }
}

// Initialize the profile manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the profile manager
    window.profileManager = new UserProfileManager();
});

// Add this to ensure the profile is properly saved
function saveProfile(profile) {
    localStorage.setItem('dinoPlayerProfile', JSON.stringify(profile));
    
    // Make sure the profile is available globally
    window.playerProfile = profile;
    
    // Dispatch event to notify other components
    const event = new CustomEvent('profileComplete', { 
        detail: profile 
    });
    document.dispatchEvent(event);
    
    console.log("Profile saved:", profile);
} 