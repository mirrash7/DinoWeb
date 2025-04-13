class UserProfileManager {
    constructor() {
        this.profileData = {
            difficulty: 1 // Default to Medium (0=Easy, 1=Medium, 2=Hard)
        };
        
        // Expanded country list with flag emojis - fixed and complete
        this.countries = [
            // Major countries first
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
            
            // All countries alphabetically
            { code: 'AF', name: '🇦🇫 Afghanistan' },
            { code: 'AL', name: '🇦🇱 Albania' },
            { code: 'DZ', name: '🇩🇿 Algeria' },
            { code: 'AD', name: '🇦🇩 Andorra' },
            { code: 'AO', name: '🇦🇴 Angola' },
            { code: 'AG', name: '🇦🇬 Antigua and Barbuda' },
            { code: 'AR', name: '🇦🇷 Argentina' },
            { code: 'AM', name: '🇦🇲 Armenia' },
            { code: 'AT', name: '🇦🇹 Austria' },
            { code: 'AZ', name: '🇦🇿 Azerbaijan' },
            { code: 'BS', name: '🇧🇸 Bahamas' },
            { code: 'BH', name: '🇧🇭 Bahrain' },
            { code: 'BD', name: '🇧🇩 Bangladesh' },
            { code: 'BB', name: '🇧🇧 Barbados' },
            { code: 'BY', name: '🇧🇾 Belarus' },
            { code: 'BE', name: '🇧🇪 Belgium' },
            { code: 'BZ', name: '🇧🇿 Belize' },
            { code: 'BJ', name: '🇧🇯 Benin' },
            { code: 'BT', name: '🇧🇹 Bhutan' },
            { code: 'BO', name: '🇧🇴 Bolivia' },
            { code: 'BA', name: '🇧🇦 Bosnia and Herzegovina' },
            { code: 'BW', name: '🇧🇼 Botswana' },
            { code: 'BN', name: '🇧🇳 Brunei' },
            { code: 'BG', name: '🇧🇬 Bulgaria' },
            { code: 'BF', name: '🇧🇫 Burkina Faso' },
            { code: 'BI', name: '🇧🇮 Burundi' },
            { code: 'KH', name: '🇰🇭 Cambodia' },
            { code: 'CM', name: '🇨🇲 Cameroon' },
            { code: 'CV', name: '🇨🇻 Cape Verde' },
            { code: 'CF', name: '🇨🇫 Central African Republic' },
            { code: 'TD', name: '🇹🇩 Chad' },
            { code: 'CL', name: '🇨🇱 Chile' },
            { code: 'CO', name: '🇨🇴 Colombia' },
            { code: 'KM', name: '🇰🇲 Comoros' },
            { code: 'CG', name: '🇨🇬 Congo' },
            { code: 'CD', name: '🇨🇩 DR Congo' },
            { code: 'CR', name: '🇨🇷 Costa Rica' },
            { code: 'HR', name: '🇭🇷 Croatia' },
            { code: 'CU', name: '🇨🇺 Cuba' },
            { code: 'CY', name: '🇨🇾 Cyprus' },
            { code: 'CZ', name: '🇨🇿 Czech Republic' },
            { code: 'DK', name: '🇩🇰 Denmark' },
            { code: 'DJ', name: '🇩🇯 Djibouti' },
            { code: 'DM', name: '🇩🇲 Dominica' },
            { code: 'DO', name: '🇩🇴 Dominican Republic' },
            { code: 'EC', name: '🇪🇨 Ecuador' },
            { code: 'EG', name: '🇪🇬 Egypt' },
            { code: 'SV', name: '🇸🇻 El Salvador' },
            { code: 'GQ', name: '🇬🇶 Equatorial Guinea' },
            { code: 'ER', name: '🇪🇷 Eritrea' },
            { code: 'EE', name: '🇪🇪 Estonia' },
            { code: 'SZ', name: '🇸🇿 Eswatini' },
            { code: 'ET', name: '🇪🇹 Ethiopia' },
            { code: 'FJ', name: '🇫🇯 Fiji' },
            { code: 'FI', name: '🇫🇮 Finland' },
            { code: 'GA', name: '🇬🇦 Gabon' },
            { code: 'GM', name: '🇬🇲 Gambia' },
            { code: 'GE', name: '🇬🇪 Georgia' },
            { code: 'GH', name: '🇬🇭 Ghana' },
            { code: 'GR', name: '🇬🇷 Greece' },
            { code: 'GD', name: '🇬🇩 Grenada' },
            { code: 'GT', name: '🇬🇹 Guatemala' },
            { code: 'GN', name: '🇬🇳 Guinea' },
            { code: 'GW', name: '🇬🇼 Guinea-Bissau' },
            { code: 'GY', name: '🇬🇾 Guyana' },
            { code: 'HT', name: '🇭🇹 Haiti' },
            { code: 'HN', name: '🇭🇳 Honduras' },
            { code: 'HU', name: '🇭🇺 Hungary' },
            { code: 'IS', name: '🇮🇸 Iceland' },
            { code: 'ID', name: '🇮🇩 Indonesia' },
            { code: 'IR', name: '🇮🇷 Iran' },
            { code: 'IQ', name: '🇮🇶 Iraq' },
            { code: 'IE', name: '🇮🇪 Ireland' },
            { code: 'IL', name: '🇮🇱 Israel' },
            { code: 'JM', name: '🇯🇲 Jamaica' },
            { code: 'JO', name: '🇯🇴 Jordan' },
            { code: 'KZ', name: '🇰🇿 Kazakhstan' },
            { code: 'KE', name: '🇰🇪 Kenya' },
            { code: 'KI', name: '🇰🇮 Kiribati' },
            { code: 'KW', name: '🇰🇼 Kuwait' },
            { code: 'KG', name: '🇰🇬 Kyrgyzstan' },
            { code: 'LA', name: '🇱🇦 Laos' },
            { code: 'LV', name: '🇱🇻 Latvia' },
            { code: 'LB', name: '🇱🇧 Lebanon' },
            { code: 'LS', name: '🇱🇸 Lesotho' },
            { code: 'LR', name: '🇱🇷 Liberia' },
            { code: 'LY', name: '🇱🇾 Libya' },
            { code: 'LI', name: '🇱🇮 Liechtenstein' },
            { code: 'LT', name: '🇱🇹 Lithuania' },
            { code: 'LU', name: '🇱🇺 Luxembourg' },
            { code: 'MG', name: '🇲🇬 Madagascar' },
            { code: 'MW', name: '🇲🇼 Malawi' },
            { code: 'MY', name: '🇲🇾 Malaysia' },
            { code: 'MV', name: '🇲🇻 Maldives' },
            { code: 'ML', name: '🇲🇱 Mali' },
            { code: 'MT', name: '🇲🇹 Malta' },
            { code: 'MH', name: '🇲🇭 Marshall Islands' },
            { code: 'MR', name: '🇲🇷 Mauritania' },
            { code: 'MU', name: '🇲🇺 Mauritius' },
            { code: 'MD', name: '🇲🇩 Moldova' },
            { code: 'MC', name: '🇲🇨 Monaco' },
            { code: 'MN', name: '🇲🇳 Mongolia' },
            { code: 'ME', name: '🇲🇪 Montenegro' },
            { code: 'MA', name: '🇲🇦 Morocco' },
            { code: 'MZ', name: '🇲🇿 Mozambique' },
            { code: 'MM', name: '🇲🇲 Myanmar' },
            { code: 'NA', name: '🇳🇦 Namibia' },
            { code: 'NR', name: '🇳🇷 Nauru' },
            { code: 'NP', name: '🇳🇵 Nepal' },
            { code: 'NL', name: '🇳🇱 Netherlands' },
            { code: 'NZ', name: '🇳🇿 New Zealand' },
            { code: 'NI', name: '🇳🇮 Nicaragua' },
            { code: 'NE', name: '🇳🇪 Niger' },
            { code: 'NG', name: '🇳🇬 Nigeria' },
            { code: 'KP', name: '🇰🇵 North Korea' },
            { code: 'MK', name: '🇲🇰 North Macedonia' },
            { code: 'NO', name: '🇳🇴 Norway' },
            { code: 'OM', name: '🇴🇲 Oman' },
            { code: 'PK', name: '🇵🇰 Pakistan' },
            { code: 'PW', name: '🇵🇼 Palau' },
            { code: 'PS', name: '🇵🇸 Palestine' },
            { code: 'PA', name: '🇵🇦 Panama' },
            { code: 'PG', name: '🇵🇬 Papua New Guinea' },
            { code: 'PY', name: '🇵🇾 Paraguay' },
            { code: 'PE', name: '🇵🇪 Peru' },
            { code: 'PH', name: '🇵🇭 Philippines' },
            { code: 'PL', name: '🇵🇱 Poland' },
            { code: 'PT', name: '🇵🇹 Portugal' },
            { code: 'QA', name: '🇶🇦 Qatar' },
            { code: 'RO', name: '🇷🇴 Romania' },
            { code: 'RW', name: '🇷🇼 Rwanda' },
            { code: 'KN', name: '🇰🇳 Saint Kitts and Nevis' },
            { code: 'LC', name: '🇱🇨 Saint Lucia' },
            { code: 'VC', name: '🇻🇨 Saint Vincent and the Grenadines' },
            { code: 'WS', name: '🇼🇸 Samoa' },
            { code: 'SM', name: '🇸🇲 San Marino' },
            { code: 'ST', name: '🇸🇹 São Tomé and Príncipe' },
            { code: 'SA', name: '🇸🇦 Saudi Arabia' },
            { code: 'SN', name: '🇸🇳 Senegal' },
            { code: 'RS', name: '🇷🇸 Serbia' },
            { code: 'SC', name: '🇸🇨 Seychelles' },
            { code: 'SL', name: '🇸🇱 Sierra Leone' },
            { code: 'SG', name: '🇸🇬 Singapore' },
            { code: 'SK', name: '🇸🇰 Slovakia' },
            { code: 'SI', name: '🇸🇮 Slovenia' },
            { code: 'SB', name: '🇸🇧 Solomon Islands' },
            { code: 'SO', name: '🇸🇴 Somalia' },
            { code: 'ZA', name: '🇿🇦 South Africa' },
            { code: 'SS', name: '🇸🇸 South Sudan' },
            { code: 'LK', name: '🇱🇰 Sri Lanka' },
            { code: 'SD', name: '🇸🇩 Sudan' },
            { code: 'SR', name: '🇸🇷 Suriname' },
            { code: 'SE', name: '🇸🇪 Sweden' },
            { code: 'CH', name: '🇨🇭 Switzerland' },
            { code: 'SY', name: '🇸🇾 Syria' },
            { code: 'TW', name: '🇹🇼 Taiwan' },
            { code: 'TJ', name: '🇹🇯 Tajikistan' },
            { code: 'TZ', name: '🇹🇿 Tanzania' },
            { code: 'TH', name: '🇹🇭 Thailand' },
            { code: 'TL', name: '🇹🇱 Timor-Leste' },
            { code: 'TG', name: '🇹🇬 Togo' },
            { code: 'TO', name: '🇹🇴 Tonga' },
            { code: 'TT', name: '🇹🇹 Trinidad and Tobago' },
            { code: 'TN', name: '🇹🇳 Tunisia' },
            { code: 'TR', name: '🇹🇷 Turkey' },
            { code: 'TM', name: '🇹🇲 Turkmenistan' },
            { code: 'TV', name: '🇹🇻 Tuvalu' },
            { code: 'UG', name: '🇺🇬 Uganda' },
            { code: 'UA', name: '🇺🇦 Ukraine' },
            { code: 'AE', name: '🇦🇪 United Arab Emirates' },
            { code: 'UY', name: '🇺🇾 Uruguay' },
            { code: 'UZ', name: '🇺🇿 Uzbekistan' },
            { code: 'VU', name: '🇻🇺 Vanuatu' },
            { code: 'VA', name: '🇻🇦 Vatican City' },
            { code: 'VE', name: '🇻🇪 Venezuela' },
            { code: 'VN', name: '🇻🇳 Vietnam' },
            { code: 'YE', name: '🇾🇪 Yemen' },
            { code: 'ZM', name: '🇿🇲 Zambia' },
            { code: 'ZW', name: '🇿🇼 Zimbabwe' },
            
            // Territories and dependencies
            { code: 'PR', name: '🇵🇷 Puerto Rico' },
            { code: 'GU', name: '🇬🇺 Guam' },
            { code: 'AS', name: '🇦🇸 American Samoa' },
            { code: 'VI', name: '🇻🇮 US Virgin Islands' },
            { code: 'BM', name: '🇧🇲 Bermuda' },
            { code: 'KY', name: '🇰🇾 Cayman Islands' },
            { code: 'GI', name: '🇬🇮 Gibraltar' },
            { code: 'FK', name: '🇫🇰 Falkland Islands' },
            { code: 'PF', name: '🇵🇫 French Polynesia' },
            { code: 'NC', name: '🇳🇨 New Caledonia' },
            { code: 'GL', name: '🇬🇱 Greenland' },
            { code: 'FO', name: '🇫🇴 Faroe Islands' },
            { code: 'HK', name: '🇭🇰 Hong Kong' },
            { code: 'MO', name: '🇲🇴 Macau' },
            
            // Other territories and regions
            { code: 'XK', name: '🇽🇰 Kosovo' },
            { code: 'EH', name: '🇪🇭 Western Sahara' },
            { code: 'CK', name: '🇨🇰 Cook Islands' },
            { code: 'NU', name: '🇳🇺 Niue' },
            { code: 'MS', name: '🇲🇸 Montserrat' },
            { code: 'AI', name: '🇦🇮 Anguilla' },
            { code: 'AW', name: '🇦🇼 Aruba' },
            { code: 'CW', name: '🇨🇼 Curaçao' },
            { code: 'SX', name: '🇸🇽 Sint Maarten' },
            { code: 'TC', name: '🇹🇨 Turks and Caicos Islands' },
            { code: 'VG', name: '🇻🇬 British Virgin Islands' },
            { code: 'GF', name: '🇬🇫 French Guiana' },
            { code: 'GP', name: '🇬🇵 Guadeloupe' },
            { code: 'MQ', name: '🇲🇶 Martinique' },
            { code: 'RE', name: '🇷🇪 Réunion' },
            { code: 'YT', name: '🇾🇹 Mayotte' },
            { code: 'BL', name: '🇧🇱 Saint Barthélemy' },
            { code: 'MF', name: '🇲🇫 Saint Martin' },
            { code: 'PM', name: '🇵🇲 Saint Pierre and Miquelon' },
            { code: 'WF', name: '🇼🇫 Wallis and Futuna' },
            { code: 'GG', name: '🇬🇬 Guernsey' },
            { code: 'JE', name: '🇯🇪 Jersey' },
            { code: 'IM', name: '🇮🇲 Isle of Man' },
            
            // Add an option for "Other"
            { code: 'XX', name: '🏳️ Other/Not Listed' }
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
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // Create start button
        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.textContent = 'Start Game';
        startButton.addEventListener('click', () => {
            // ... existing start game code ...
        });
        
        // Add the start button to the container
        buttonContainer.appendChild(startButton);
        
        // Assemble form
        form.appendChild(difficultyGroup);
        form.appendChild(buttonContainer);
        
        // Assemble form container
        formContainer.appendChild(title);
        formContainer.appendChild(form);
        
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
    showHighScorePrompt(score, highScoreType, callback) {
        // Create overlay
        const overlay = document.createElement('div');
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
        promptContainer.style.padding = '20px';
        promptContainer.style.borderRadius = '10px';
        promptContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
        promptContainer.style.width = '90%';
        promptContainer.style.maxWidth = '400px';
        promptContainer.style.maxHeight = '90vh';
        promptContainer.style.display = 'flex';
        promptContainer.style.flexDirection = 'column';
        
        // Create title with achievement type
        const title = document.createElement('h2');
        title.textContent = `New ${highScoreType} High Score!`;
        title.style.textAlign = 'center';
        title.style.color = '#4CAF50';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '22px';
        
        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.textContent = `Your Score: ${score}`;
        scoreDisplay.style.textAlign = 'center';
        scoreDisplay.style.fontSize = '24px';
        scoreDisplay.style.fontWeight = 'bold';
        scoreDisplay.style.margin = '0 0 15px 0';
        
        // Create form
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';
        form.style.flex = '1';
        form.addEventListener('submit', (e) => e.preventDefault());
        
        // Create acronym group
        const acronymGroup = document.createElement('div');
        acronymGroup.style.marginBottom = '10px';
        
        const acronymLabel = document.createElement('label');
        acronymLabel.textContent = 'Your 3-letter name:';
        acronymLabel.style.display = 'block';
        acronymLabel.style.marginBottom = '5px';
        acronymLabel.style.fontWeight = 'bold';
        
        const acronymInput = document.createElement('input');
        acronymInput.type = 'text';
        acronymInput.maxLength = 3;
        acronymInput.style.width = '100%';
        acronymInput.style.padding = '8px';
        acronymInput.style.fontSize = '16px';
        acronymInput.style.borderRadius = '4px';
        acronymInput.style.border = '1px solid #ccc';
        acronymInput.style.boxSizing = 'border-box';
        
        acronymGroup.appendChild(acronymLabel);
        acronymGroup.appendChild(acronymInput);
        
        // Create country group
        const countryGroup = document.createElement('div');
        countryGroup.style.marginBottom = '10px';
        
        const countryLabel = document.createElement('label');
        countryLabel.textContent = 'Your country:';
        countryLabel.style.display = 'block';
        countryLabel.style.marginBottom = '5px';
        countryLabel.style.fontWeight = 'bold';
        
        const countrySelect = document.createElement('select');
        countrySelect.style.width = '100%';
        countrySelect.style.padding = '8px';
        countrySelect.style.fontSize = '16px';
        countrySelect.style.borderRadius = '4px';
        countrySelect.style.border = '1px solid #ccc';
        countrySelect.style.boxSizing = 'border-box';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Country --';
        countrySelect.appendChild(emptyOption);
        
        // Add country options
        this.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
        
        countryGroup.appendChild(countryLabel);
        countryGroup.appendChild(countrySelect);
        
        // Create button group
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '10px';
        buttonGroup.style.marginTop = '10px';
        
        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip';
        skipButton.type = 'button';
        skipButton.style.padding = '10px';
        skipButton.style.backgroundColor = '#f0f0f0';
        skipButton.style.color = '#333';
        skipButton.style.border = 'none';
        skipButton.style.borderRadius = '5px';
        skipButton.style.fontSize = '16px';
        skipButton.style.cursor = 'pointer';
        skipButton.style.flex = '1';
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Score';
        saveButton.type = 'submit';
        saveButton.style.padding = '10px';
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
            const acronymValue = acronymInput.value.toUpperCase();
            const isValidLength = acronymValue.length === 3;
            const isAllowed = !this.isProhibitedAcronym(acronymValue);
            const hasCountry = countrySelect.value !== '';
            
            const isValid = isValidLength && isAllowed && hasCountry;
            saveButton.disabled = !isValid;
        
        // Visual feedback
            if (!isValidLength) {
                acronymInput.style.borderColor = acronymValue.length > 0 ? '#ff9800' : '#ccc';
            } else if (!isAllowed) {
                acronymInput.style.borderColor = '#ff0000'; // Red for prohibited terms
            } else {
            acronymInput.style.borderColor = '#4CAF50';
        }
        
        if (countrySelect.value !== '') {
            countrySelect.style.borderColor = '#4CAF50';
        } else {
            countrySelect.style.borderColor = '#ccc';
        }
            
            // Show error message for prohibited acronyms
            if (!isAllowed && isValidLength) {
                if (!document.getElementById('acronym-error')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.id = 'acronym-error';
                    errorMsg.textContent = 'This acronym is not allowed. Please choose another.';
                    errorMsg.style.color = '#ff0000';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '5px';
                    acronymGroup.appendChild(errorMsg);
                }
            } else {
                const errorMsg = document.getElementById('acronym-error');
                if (errorMsg) {
                    acronymGroup.removeChild(errorMsg);
                }
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
            
            // Reset the game's flag
            if (window.game) {
                window.game.isHighScorePromptOpen = false;
            }
            
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
                
                // Reset the game's flag
                if (window.game) {
                    window.game.isHighScorePromptOpen = false;
                }
                
                if (callback) callback(playerData);
            }
        });
        
        // Focus the acronym input
        setTimeout(() => {
            acronymInput.focus();
        }, 100);
    }
    
    isProhibitedAcronym(acronym) {
        // List of prohibited 3-letter acronyms
        const prohibitedList = [
            // Offensive terms
            'ASS', 'FAG', 'GAY', 'NIG', 'NGR', 'GER', 'CUM', 'JEW',
            // Additional offensive terms
            'KKK', 'KYS', 'DIE', 'FUK', 'FUC', 'FCK', 'SEX', 'XXX',
            'POO', 'PEE', 'WTF', 'FML', 'STD', 'HIV', 'NAZ', 'KYS',
            'KMS', 'SUK', 'SUC', 'VAG', 'DIK', 'DCK', 'COK', 'COC'
        ];
        
        return prohibitedList.includes(acronym);
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