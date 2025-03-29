class UserProfileManager {
    constructor() {
        this.profileData = {
            acronym: '',
            country: ''
        };
        
        // Country list with flag emojis
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
        title.textContent = 'Create Your Player Profile';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.color = '#333';
        
        // Create form
        const form = document.createElement('form');
        form.id = 'profile-form';
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '20px';
        
        // Create acronym input
        const acronymGroup = document.createElement('div');
        acronymGroup.style.display = 'flex';
        acronymGroup.style.flexDirection = 'column';
        acronymGroup.style.gap = '5px';
        
        const acronymLabel = document.createElement('label');
        acronymLabel.htmlFor = 'acronym-input';
        acronymLabel.textContent = 'Enter your 3-letter acronym:';
        acronymLabel.style.fontWeight = 'bold';
        
        const acronymInput = document.createElement('input');
        acronymInput.type = 'text';
        acronymInput.id = 'acronym-input';
        acronymInput.maxLength = 3;
        acronymInput.placeholder = 'ABC';
        acronymInput.style.padding = '10px';
        acronymInput.style.fontSize = '16px';
        acronymInput.style.borderRadius = '5px';
        acronymInput.style.border = '1px solid #ccc';
        
        const acronymHint = document.createElement('small');
        acronymHint.textContent = 'Must be exactly 3 letters';
        acronymHint.style.color = '#666';
        
        acronymGroup.appendChild(acronymLabel);
        acronymGroup.appendChild(acronymInput);
        acronymGroup.appendChild(acronymHint);
        
        // Create country select
        const countryGroup = document.createElement('div');
        countryGroup.style.display = 'flex';
        countryGroup.style.flexDirection = 'column';
        countryGroup.style.gap = '5px';
        
        const countryLabel = document.createElement('label');
        countryLabel.htmlFor = 'country-select';
        countryLabel.textContent = 'Select your country:';
        countryLabel.style.fontWeight = 'bold';
        
        const countrySelect = document.createElement('select');
        countrySelect.id = 'country-select';
        countrySelect.style.padding = '10px';
        countrySelect.style.fontSize = '16px';
        countrySelect.style.borderRadius = '5px';
        countrySelect.style.border = '1px solid #ccc';
        
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
        submitButton.style.marginTop = '10px';
        submitButton.disabled = true;
        
        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'profile-loading';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.marginTop = '20px';
        loadingIndicator.style.color = '#666';
        
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Game is loading in the background...';
        loadingText.style.margin = '5px 0';
        
        const loadingProgress = document.createElement('div');
        loadingProgress.id = 'loading-progress-bar';
        loadingProgress.style.width = '100%';
        loadingProgress.style.height = '10px';
        loadingProgress.style.backgroundColor = '#f0f0f0';
        loadingProgress.style.borderRadius = '5px';
        loadingProgress.style.overflow = 'hidden';
        loadingProgress.style.marginTop = '5px';
        
        const progressFill = document.createElement('div');
        progressFill.id = 'progress-fill';
        progressFill.style.width = '0%';
        progressFill.style.height = '100%';
        progressFill.style.backgroundColor = '#4CAF50';
        progressFill.style.transition = 'width 0.3s ease';
        
        loadingProgress.appendChild(progressFill);
        loadingIndicator.appendChild(loadingText);
        loadingIndicator.appendChild(loadingProgress);
        
        // Assemble form
        form.appendChild(acronymGroup);
        form.appendChild(countryGroup);
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
        const acronymInput = document.getElementById('acronym-input');
        const countrySelect = document.getElementById('country-select');
        const submitButton = document.getElementById('profile-submit');
        const form = document.getElementById('profile-form');
        
        // Validate acronym on input
        acronymInput.addEventListener('input', () => {
            // Convert to uppercase
            acronymInput.value = acronymInput.value.toUpperCase();
            
            // Only allow letters
            acronymInput.value = acronymInput.value.replace(/[^A-Z]/g, '');
            
            this.validateForm();
        });
        
        // Validate on country select
        countrySelect.addEventListener('change', () => {
            this.validateForm();
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save profile data
            this.profileData.acronym = acronymInput.value;
            this.profileData.country = countrySelect.value;
            
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
    
    validateForm() {
        const acronymInput = document.getElementById('acronym-input');
        const countrySelect = document.getElementById('country-select');
        const submitButton = document.getElementById('profile-submit');
        
        // Check if acronym is exactly 3 letters and country is selected
        const isValid = acronymInput.value.length === 3 && countrySelect.value !== '';
        
        // Enable/disable submit button
        submitButton.disabled = !isValid;
        
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
    }
    
    updateLoadingProgress(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
    }
}

// Initialize the profile manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the profile manager
    window.profileManager = new UserProfileManager();
}); 