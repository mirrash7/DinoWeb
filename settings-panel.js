class SettingsPanel {
    constructor(game) {
        this.game = game;
        this.isVisible = false;
        this.activeTab = 'settings';
        
        // Mock data for demonstration
        this.leaderboard = [
            { rank: 1, name: 'JKL', country: 'US', score: 1250 },
            { rank: 2, name: 'ABC', country: 'GB', score: 1100 },
            { rank: 3, name: 'XYZ', country: 'JP', score: 950 },
            { rank: 4, name: 'DEF', country: 'DE', score: 900 },
            { rank: 5, name: 'GHI', country: 'FR', score: 850 },
            { rank: 6, name: 'MNO', country: 'CA', score: 800 },
            { rank: 7, name: 'PQR', country: 'AU', score: 750 },
            { rank: 8, name: 'STU', country: 'BR', score: 700 },
            { rank: 9, name: 'VWX', country: 'IN', score: 650 },
            { rank: 10, name: 'YZA', country: 'IT', score: 600 }
        ];
        
        this.stats = {
            totalPlayers: 1243,
            todayPlayers: 87,
            averageScore: 432,
            gamesPlayed: 3521
        };
        
        this.settings = {
            soundEnabled: true,
            showFPS: false,
            reducedMotion: false,
            highContrast: true,
            fullOpacityWebcam: false
        };
        
        this.createPanel();
        this.setupEventListeners();
        
        // Apply high contrast immediately
        this.applySettings();
    }
    
    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'settings-panel';
        this.panel.className = 'settings-panel';
        this.panel.style.display = 'none';
        
        // Create panel header
        const header = document.createElement('div');
        header.className = 'settings-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Game Menu';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'close-btn';
        closeBtn.addEventListener('click', () => this.toggle());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create tabs
        const tabs = document.createElement('div');
        tabs.className = 'settings-tabs';
        
        const tabNames = ['Settings', 'Leaderboard', 'Stats'];
        tabNames.forEach(tabName => {
            const tab = document.createElement('button');
            tab.textContent = tabName;
            tab.dataset.tab = tabName.toLowerCase();
            tab.className = 'tab-btn';
            if (tabName.toLowerCase() === this.activeTab) {
                tab.classList.add('active');
            }
            tab.addEventListener('click', () => this.switchTab(tabName.toLowerCase()));
            tabs.appendChild(tab);
        });
        
        // Create content container
        this.content = document.createElement('div');
        this.content.className = 'settings-content';
        
        // Assemble panel
        this.panel.appendChild(header);
        this.panel.appendChild(tabs);
        this.panel.appendChild(this.content);
        
        // Add to game section
        document.querySelector('.game-section').appendChild(this.panel);
        
        // Create tab contents
        this.createSettingsTab();
        this.createLeaderboardTab();
        this.createStatsTab();
        
        // Show initial tab
        this.switchTab(this.activeTab);
        
        // Create toggle button that appears in-game
        this.createToggleButton();
    }
    
    createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'settings-toggle';
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.title = 'Settings';
        toggleBtn.addEventListener('click', () => this.toggle());
        document.querySelector('.game-section').appendChild(toggleBtn);
    }
    
    createSettingsTab() {
        const settingsContent = document.createElement('div');
        settingsContent.className = 'tab-content';
        settingsContent.id = 'settings-tab';
        
        const settingsList = document.createElement('div');
        settingsList.className = 'settings-list';
        
        // Difficulty setting (already the first option)
        const difficultySetting = this.createDifficultySetting();
        
        // Sound toggle
        const soundSetting = this.createToggleSetting(
            'Sound', 
            'Enable game sounds', 
            'soundEnabled',
            this.settings.soundEnabled
        );
        
        // Hide webcam toggle
        const webcamOpacitySetting = this.createToggleSetting(
            'Hide Webcam', 
            'Hide webcam feed for privacy (only show pose detection)', 
            'fullOpacityWebcam',
            this.settings.fullOpacityWebcam
        );
        
        // FPS display toggle
        const fpsSetting = this.createToggleSetting(
            'Show FPS', 
            'Display frames per second counter', 
            'showFPS',
            this.settings.showFPS
        );
        
        // High contrast toggle
        const contrastSetting = this.createToggleSetting(
            'High Contrast', 
            'Increase visual contrast for accessibility', 
            'highContrast',
            this.settings.highContrast
        );
        
        // Reduced motion toggle
        const motionSetting = this.createToggleSetting(
            'Reduced Motion', 
            'Decrease visual effects for accessibility', 
            'reducedMotion',
            this.settings.reducedMotion
        );
        
        // Add settings in the specified order
        settingsList.appendChild(difficultySetting);
        settingsList.appendChild(soundSetting);
        settingsList.appendChild(webcamOpacitySetting);
        settingsList.appendChild(fpsSetting);
        settingsList.appendChild(contrastSetting);
        settingsList.appendChild(motionSetting);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = 'Reset All Settings';
        resetBtn.addEventListener('click', () => this.resetSettings());
        
        settingsContent.appendChild(settingsList);
        settingsContent.appendChild(resetBtn);
        
        this.content.appendChild(settingsContent);
    }
    
    createToggleSetting(name, description, key, initialValue) {
        const setting = document.createElement('div');
        setting.className = 'setting-item';
        
        const info = document.createElement('div');
        info.className = 'setting-info';
        
        const title = document.createElement('h3');
        title.textContent = name;
        
        const desc = document.createElement('p');
        desc.textContent = description;
        
        info.appendChild(title);
        info.appendChild(desc);
        
        const toggle = document.createElement('label');
        toggle.className = 'toggle-switch';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = initialValue;
        checkbox.dataset.setting = key;
        checkbox.addEventListener('change', (e) => {
            this.settings[key] = e.target.checked;
            this.applySettings();
        });
        
        const slider = document.createElement('span');
        slider.className = 'slider';
        
        toggle.appendChild(checkbox);
        toggle.appendChild(slider);
        
        setting.appendChild(info);
        setting.appendChild(toggle);
        
        return setting;
    }
    
    createLeaderboardTab() {
        const leaderboardContent = document.createElement('div');
        leaderboardContent.className = 'tab-content leaderboard-content';
        leaderboardContent.id = 'leaderboard-tab';
        
        // Create leaderboard container
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.className = 'leaderboard-container';
        
        // Create tabs for different leaderboard types
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'leaderboard-tabs';
        
        const tabs = [
            { id: 'allTime', label: 'All Time' },
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' }
        ];
        
        tabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.className = 'leaderboard-tab-btn';
            if (tab.id === 'allTime') {
                tabButton.classList.add('active');
            }
            tabButton.textContent = tab.label;
            tabButton.addEventListener('click', () => {
                // Update active tab
                document.querySelectorAll('.leaderboard-tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                tabButton.classList.add('active');
                
                // Switch leaderboard type
                if (window.highScoreManager) {
                    window.highScoreManager.setLeaderboardType(tab.id);
                    window.highScoreManager.updateLeaderboardTable();
                }
            });
            
            tabsContainer.appendChild(tabButton);
        });
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'leaderboard-table-container';
        
        // Add Firebase test buttons at the bottom of the leaderboard tab
        const testSection = document.createElement('div');
        testSection.className = 'leaderboard-test-section';
        testSection.style.marginTop = '20px';
        testSection.style.borderTop = '1px solid #ddd';
        testSection.style.paddingTop = '15px';
        
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Firebase Connection';
        testButton.className = 'test-btn';
        testButton.addEventListener('click', () => this.testFirebaseConnection());
        
        const testScoreButton = document.createElement('button');
        testScoreButton.textContent = 'Submit Test Score';
        testScoreButton.className = 'test-btn';
        testScoreButton.style.marginLeft = '10px';
        testScoreButton.addEventListener('click', () => {
            if (window.highScoreManager) {
                window.highScoreManager.submitTestScore()
                    .then(success => {
                        if (success) {
                            // Update the leaderboard display
                            this.updateLeaderboard();
                        }
                    });
            } else {
                alert("Error: High score manager not initialized");
            }
        });
        
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 Refresh Scores';
        refreshButton.className = 'test-btn';
        refreshButton.style.marginLeft = '10px';
        refreshButton.addEventListener('click', () => this.updateLeaderboard());
        
        testSection.appendChild(testButton);
        testSection.appendChild(testScoreButton);
        testSection.appendChild(refreshButton);
        
        // Assemble leaderboard
        leaderboardContainer.appendChild(tabsContainer);
        leaderboardContainer.appendChild(tableContainer);
        leaderboardContainer.appendChild(testSection);
        
        leaderboardContent.appendChild(leaderboardContainer);
        this.content.appendChild(leaderboardContent);
        
        // Initialize with high score manager if available
        if (window.highScoreManager) {
            window.highScoreManager.updateLeaderboardDisplay();
        }
    }
    
    createStatsTab() {
        const statsContent = document.createElement('div');
        statsContent.className = 'tab-content';
        statsContent.id = 'stats-tab';
        
        const statsList = document.createElement('div');
        statsList.className = 'stats-list';
        
        // Create stat items
        const totalPlayers = this.createStatItem('Total Players', this.stats.totalPlayers);
        const todayPlayers = this.createStatItem('Players Today', this.stats.todayPlayers);
        const avgScore = this.createStatItem('Average Score', this.stats.averageScore);
        const gamesPlayed = this.createStatItem('Games Played', this.stats.gamesPlayed);
        
        // Your stats section
        const yourStats = document.createElement('div');
        yourStats.className = 'your-stats';
        
        const yourStatsTitle = document.createElement('h3');
        yourStatsTitle.textContent = 'Your Stats';
        
        const personalBest = this.createStatItem('Personal Best', 0);
        const gamesPlayedByYou = this.createStatItem('Games Played', 0);
        
        yourStats.appendChild(yourStatsTitle);
        yourStats.appendChild(personalBest);
        yourStats.appendChild(gamesPlayedByYou);
        
        statsList.appendChild(totalPlayers);
        statsList.appendChild(todayPlayers);
        statsList.appendChild(avgScore);
        statsList.appendChild(gamesPlayed);
        
        statsContent.appendChild(statsList);
        statsContent.appendChild(yourStats);
        
        this.content.appendChild(statsContent);
    }
    
    createStatItem(label, value) {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = label;
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = value.toLocaleString();
        
        statItem.appendChild(statLabel);
        statItem.appendChild(statValue);
        
        return statItem;
    }
    
    switchTab(tabName) {
        // Update active tab button
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Show selected tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // Special handling for leaderboard tab
        if (tabName === 'leaderboard') {
            document.querySelector('.leaderboard-content').style.display = 'block';
            // Update leaderboard data when tab is selected
            this.updateLeaderboard();
        } else {
            document.getElementById(`${tabName}-tab`).style.display = 'block';
        }
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.panel.style.display = 'flex';
            if (this.game) {
                this.game.isPaused = true;
            }
            
            // Load leaderboard data when panel is opened
            this.updateLeaderboard();
        } else {
            this.panel.style.display = 'none';
            if (this.game) {
                this.game.isPaused = false;
            }
        }
    }
    
    resetSettings() {
        // Reset to defaults
        this.settings = {
            soundEnabled: true,
            showFPS: false,
            reducedMotion: false,
            highContrast: true,
            fullOpacityWebcam: false
        };
        
        // Update UI
        const checkboxes = document.querySelectorAll('input[data-setting]');
        checkboxes.forEach(checkbox => {
            const key = checkbox.dataset.setting;
            checkbox.checked = this.settings[key];
        });
        
        // Apply settings
        this.applySettings();
    }
    
    applySettings() {
        // Apply settings to game
        if (this.game) {
            this.game.enableClouds = !this.settings.reducedMotion;
            this.game.reducedEffects = this.settings.reducedMotion;
            this.game.showFPS = this.settings.showFPS;
            
            // Apply high contrast if needed
            if (this.settings.highContrast) {
                this.game.colors = {
                    sky: '#ffffff',
                    ground: '#000000',
                    groundLine: '#000000',
                    scoreText: '#000000',
                    versionText: '#000000',
                    shadow: 'rgba(0, 0, 0, 0.5)',
                    gameOverGradient1: '#000000',
                    gameOverGradient2: '#000000',
                    gameOverText: '#ffffff',
                    gameOverShadow: 'rgba(0, 0, 0, 0.8)',
                    gameOverGlow: 'rgba(255, 255, 255, 0.9)'
                };
            } else {
                // Reset to original colors
                this.game.colors = {
                    sky: '#f7f7f7',
                    ground: '#e7e7e7',
                    groundLine: '#c7c7c7',
                    scoreText: '#535353',
                    versionText: '#999999',
                    shadow: 'rgba(0, 0, 0, 0.1)',
                    gameOverGradient1: '#8B4513',
                    gameOverGradient2: '#DAA520',
                    gameOverText: '#FFFFFF',
                    gameOverShadow: 'rgba(0, 0, 0, 0.5)',
                    gameOverGlow: 'rgba(255, 215, 0, 0.7)'
                };
            }
        }
        
        // Apply webcam opacity setting
        const webcam = document.getElementById('webcam');
        if (webcam) {
            webcam.style.opacity = this.settings.fullOpacityWebcam ? '0' : '0.7';
        }
        
        // Save settings to localStorage
        localStorage.setItem('dinoGameSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('dinoGameSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
            
            // Update UI
            const checkboxes = document.querySelectorAll('input[data-setting]');
            checkboxes.forEach(checkbox => {
                const key = checkbox.dataset.setting;
                checkbox.checked = this.settings[key];
            });
            
            // Apply settings
            this.applySettings();
        }
    }
    
    getCountryFlag(countryCode) {
        if (!countryCode) return '🏳️';
        
        // Convert country code to flag emoji
        return countryCode
            .toUpperCase()
            .split('')
            .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            .join('');
    }
    
    setupEventListeners() {
        // Add keyboard shortcut (Escape to toggle panel)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggle();
            }
        });
        
        // Load settings from localStorage
        window.addEventListener('load', () => {
            this.loadSettings();
        });
    }
    
    forceShow() {
        this.isVisible = true;
        this.panel.style.display = 'flex';
        if (this.game) {
            this.game.isPaused = true;
        }
        console.log("Settings panel forced to show");
    }
    
    updateLeaderboard() {
        if (window.highScoreManager) {
            window.highScoreManager.loadTopScores().then(() => {
                window.highScoreManager.updateLeaderboardDisplay();
            });
        }
    }
    
    testFirebaseConnection() {
        console.log("Testing Firebase connection...");
        
        if (!window.highScoreManager) {
            console.error("High score manager not initialized");
            alert("Error: High score manager not initialized");
            return;
        }
        
        // Try to load scores
        window.highScoreManager.loadTopScores()
            .then(scores => {
                console.log("Successfully loaded scores:", scores);
                
                // Display the scores in an alert for quick testing
                if (scores.length === 0) {
                    alert("Firebase connection successful, but no scores found. Try submitting a test score.");
                } else {
                    const scoreList = scores.map((s, i) => 
                        `${i+1}. ${s.name} (${s.country}): ${s.score}`
                    ).join('\n');
                    
                    alert(`Firebase connection successful!\n\nTop Scores:\n${scoreList}`);
                }
                
                // Update the leaderboard display
                this.updateLeaderboard();
            })
            .catch(error => {
                console.error("Error testing Firebase:", error);
                alert(`Firebase connection error: ${error.message}`);
            });
    }
    
    // Add this new method to create the difficulty setting
    createDifficultySetting() {
        const setting = document.createElement('div');
        setting.className = 'setting-item';
        
        const info = document.createElement('div');
        info.className = 'setting-info';
        
        const title = document.createElement('h3');
        title.textContent = 'Difficulty';
        
        const description = document.createElement('p');
        description.textContent = 'Change game difficulty';
        description.className = 'setting-description';
        
        info.appendChild(title);
        info.appendChild(description);
        
        const control = document.createElement('div');
        control.className = 'setting-control difficulty-control';
        
        // Create radio buttons for each difficulty level
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficultyContainer = document.createElement('div');
        difficultyContainer.className = 'difficulty-buttons';
        difficultyContainer.style.display = 'flex';
        difficultyContainer.style.gap = '10px';
        
        difficulties.forEach((diff, index) => {
            const label = document.createElement('label');
            label.className = 'difficulty-label';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
            label.style.padding = '5px 10px';
            label.style.borderRadius = '4px';
            label.style.backgroundColor = this.game.currentDifficulty === index ? '#4CAF50' : '#e0e0e0';
            label.style.color = this.game.currentDifficulty === index ? 'white' : '#333';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'difficulty';
            radio.value = index;
            radio.checked = this.game.currentDifficulty === index;
            radio.style.marginRight = '5px';
            radio.style.display = 'none'; // Hide the actual radio button
            
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    // Update game difficulty
                    this.game.currentDifficulty = index;
                    
                    // Update visual appearance of all labels
                    const labels = difficultyContainer.querySelectorAll('.difficulty-label');
                    labels.forEach((lbl, i) => {
                        lbl.style.backgroundColor = i === index ? '#4CAF50' : '#e0e0e0';
                        lbl.style.color = i === index ? 'white' : '#333';
                    });
                }
            });
            
            const text = document.createElement('span');
            text.textContent = diff;
            
            label.appendChild(radio);
            label.appendChild(text);
            difficultyContainer.appendChild(label);
        });
        
        control.appendChild(difficultyContainer);
        
        setting.appendChild(info);
        setting.appendChild(control);
        
        return setting;
    }
}

// Remove or comment out this entire event listener at the bottom of the file
/*
document.addEventListener('DOMContentLoaded', () => {
    // If the settings panel wasn't initialized in main.js, initialize it here
    if (!window.settingsPanel && window.game) {
        window.settingsPanel = new SettingsPanel(window.game);
    }
    
    // Add a keyboard shortcut for testing
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.settingsPanel) {
            window.settingsPanel.toggle();
        }
    });
    
    // Add a console command for debugging
    console.log("Settings panel initialized. Press Escape to toggle or use settingsPanel.toggle() in console");
});
*/ 