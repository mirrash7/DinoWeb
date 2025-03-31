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
            highContrast: false
        };
        
        this.createPanel();
        this.setupEventListeners();
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
        
        // Sound toggle
        const soundSetting = this.createToggleSetting(
            'Sound', 
            'Enable game sounds', 
            'soundEnabled',
            this.settings.soundEnabled
        );
        
        // FPS display toggle
        const fpsSetting = this.createToggleSetting(
            'Show FPS', 
            'Display frames per second counter', 
            'showFPS',
            this.settings.showFPS
        );
        
        // Reduced motion toggle
        const motionSetting = this.createToggleSetting(
            'Reduced Motion', 
            'Decrease visual effects for accessibility', 
            'reducedMotion',
            this.settings.reducedMotion
        );
        
        // High contrast toggle
        const contrastSetting = this.createToggleSetting(
            'High Contrast', 
            'Increase visual contrast for accessibility', 
            'highContrast',
            this.settings.highContrast
        );
        
        settingsList.appendChild(soundSetting);
        settingsList.appendChild(fpsSetting);
        settingsList.appendChild(motionSetting);
        settingsList.appendChild(contrastSetting);
        
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
        leaderboardContent.className = 'tab-content';
        leaderboardContent.id = 'leaderboard-tab';
        
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Rank', 'Player', 'Country', 'Score'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        this.leaderboard.forEach(entry => {
            const row = document.createElement('tr');
            
            const rankCell = document.createElement('td');
            rankCell.textContent = entry.rank;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            
            const countryCell = document.createElement('td');
            countryCell.textContent = this.getCountryFlag(entry.country) + ' ' + entry.country;
            
            const scoreCell = document.createElement('td');
            scoreCell.textContent = entry.score;
            
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(countryCell);
            row.appendChild(scoreCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        leaderboardContent.appendChild(table);
        
        this.content.appendChild(leaderboardContent);
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
        this.activeTab = tabName;
        
        // Update tab buttons
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update content visibility
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.style.display = this.isVisible ? 'flex' : 'none';
        
        // Pause/resume game
        if (this.game) {
            this.game.isPaused = this.isVisible;
        }
    }
    
    resetSettings() {
        // Reset to defaults
        this.settings = {
            soundEnabled: true,
            showFPS: false,
            reducedMotion: false,
            highContrast: false
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
=======
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
            highContrast: false
        };
        
        this.createPanel();
        this.setupEventListeners();
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
        const gameSection = document.querySelector('.game-section');
        if (!gameSection) {
            console.error('Game section not found');
            return;
        }
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'settings-toggle';
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.title = 'Settings';
        toggleBtn.addEventListener('click', () => this.toggle());
        gameSection.appendChild(toggleBtn);
    }
    
    createSettingsTab() {
        const settingsContent = document.createElement('div');
        settingsContent.className = 'tab-content';
        settingsContent.id = 'settings-tab';
        
        const settingsList = document.createElement('div');
        settingsList.className = 'settings-list';
        
        // Sound toggle
        const soundSetting = this.createToggleSetting(
            'Sound', 
            'Enable game sounds', 
            'soundEnabled',
            this.settings.soundEnabled
        );
        
        // FPS display toggle
        const fpsSetting = this.createToggleSetting(
            'Show FPS', 
            'Display frames per second counter', 
            'showFPS',
            this.settings.showFPS
        );
        
        // Reduced motion toggle
        const motionSetting = this.createToggleSetting(
            'Reduced Motion', 
            'Decrease visual effects for accessibility', 
            'reducedMotion',
            this.settings.reducedMotion
        );
        
        // High contrast toggle
        const contrastSetting = this.createToggleSetting(
            'High Contrast', 
            'Increase visual contrast for accessibility', 
            'highContrast',
            this.settings.highContrast
        );
        
        settingsList.appendChild(soundSetting);
        settingsList.appendChild(fpsSetting);
        settingsList.appendChild(motionSetting);
        settingsList.appendChild(contrastSetting);
        
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
        leaderboardContent.className = 'tab-content';
        leaderboardContent.id = 'leaderboard-tab';
        
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Rank', 'Player', 'Country', 'Score'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        this.leaderboard.forEach(entry => {
            const row = document.createElement('tr');
            
            const rankCell = document.createElement('td');
            rankCell.textContent = entry.rank;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            
            const countryCell = document.createElement('td');
            countryCell.textContent = this.getCountryFlag(entry.country) + ' ' + entry.country;
            
            const scoreCell = document.createElement('td');
            scoreCell.textContent = entry.score;
            
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(countryCell);
            row.appendChild(scoreCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        leaderboardContent.appendChild(table);
        
        this.content.appendChild(leaderboardContent);
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
        this.activeTab = tabName;
        
        // Update tab buttons
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update content visibility
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.style.display = this.isVisible ? 'flex' : 'none';
        
        // Pause/resume game
        if (this.game) {
            this.game.isPaused = this.isVisible;
        }
    }
    
    resetSettings() {
        // Reset to defaults
        this.settings = {
            soundEnabled: true,
            showFPS: false,
            reducedMotion: false,
            highContrast: false
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
} 