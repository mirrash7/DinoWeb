class HighScoreManager {
    constructor() {
        // Initialize Firebase config (keep your existing config)
        const firebaseConfig = {
            apiKey: "AIzaSyCikYxp5FlVgfYU4eDRNUDiDNwWdpZtzfg",
            authDomain: "dino-web-7034b.firebaseapp.com",
            databaseURL: "https://dino-web-7034b-default-rtdb.firebaseio.com",
            projectId: "dino-web-7034b",
            storageBucket: "dino-web-7034b.firebasestorage.app",
            messagingSenderId: "1027476024824",
            appId: "1:1027476024824:web:5c3cf4367bfd6215463a0d",
            measurementId: "G-HTYP6DE5D7"
        };
        
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        this.db = firebase.database();
        
        // Create references to different leaderboard types
        this.allTimeScoresRef = this.db.ref('scores/allTime');
        this.dailyScoresRef = this.db.ref('scores/daily');
        this.weeklyScoresRef = this.db.ref('scores/weekly');
        
        // Cache for top scores
        this.topScores = {
            allTime: [],
            daily: [],
            weekly: []
        };
        
        // Current leaderboard type
        this.currentLeaderboard = 'allTime';
        
        // Load scores immediately
        this.loadAllLeaderboards();
    }
    
    // Submit a score to all leaderboards
    async submitScore(playerName, country, score) {
        if (!playerName || !score) return false;
        
        try {
            // Add timestamp for sorting by recency
            const timestamp = Date.now();
            const scoreData = {
                name: playerName.substring(0, 3).toUpperCase(), // Limit to 3 chars
                country: country || 'XX',
                score: score,
                timestamp: timestamp
            };
            
            // Submit to all three leaderboards
            await Promise.all([
                this.allTimeScoresRef.push(scoreData),
                this.dailyScoresRef.push(scoreData),
                this.weeklyScoresRef.push(scoreData)
            ]);
            
            // Reload scores after submission
            await this.loadAllLeaderboards();
            return true;
        } catch (error) {
            console.error("Error submitting score:", error);
            return false;
        }
    }
    
    // Load all leaderboards
    async loadAllLeaderboards() {
        try {
            // Check if leaderboards need to be reset
            await this.checkAndResetLeaderboards();
            
            // Load scores from all leaderboards
            await Promise.all([
                this.loadTopScores('allTime'),
                this.loadTopScores('daily'),
                this.loadTopScores('weekly')
            ]);
            return true;
        } catch (error) {
            console.error("Error loading all leaderboards:", error);
            return false;
        }
    }
    
    // Load top 10 scores for a specific leaderboard
    async loadTopScores(leaderboardType = 'allTime') {
        try {
            let ref;
            switch (leaderboardType) {
                case 'daily':
                    ref = this.dailyScoresRef;
                    break;
                case 'weekly':
                    ref = this.weeklyScoresRef;
                    break;
                case 'allTime':
                default:
                    ref = this.allTimeScoresRef;
                    break;
            }
            
            // Get top 10 scores ordered by score (descending)
            const snapshot = await ref
                .orderByChild('score')
                .limitToLast(10)
                .once('value');
            
            // Convert to array and sort
            const scores = [];
            snapshot.forEach(childSnapshot => {
                scores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Sort by score (highest first)
            this.topScores[leaderboardType] = scores.sort((a, b) => b.score - a.score);
            
            return this.topScores[leaderboardType];
        } catch (error) {
            console.error(`Error loading ${leaderboardType} scores:`, error);
            return [];
        }
    }
    
    // Set current leaderboard type
    setLeaderboardType(type) {
        if (['allTime', 'daily', 'weekly'].includes(type)) {
            this.currentLeaderboard = type;
        }
    }
    
    // Get cached top scores for current leaderboard
    getTopScores(leaderboardType = null) {
        const type = leaderboardType || this.currentLeaderboard;
        return this.topScores[type] || [];
    }
    
    // Check if a score qualifies for the current leaderboard
    isHighScore(score, leaderboardType = null) {
        const type = leaderboardType || this.currentLeaderboard;
        const scores = this.topScores[type];
        
        if (scores.length < 10) return true;
        return score > scores[scores.length - 1].score;
    }
    
    // Display scores in the settings panel
    updateLeaderboardDisplay() {
        const leaderboardContainer = document.querySelector('.leaderboard-content');
        if (!leaderboardContainer) return;
        
        // Clear existing content
        leaderboardContainer.innerHTML = '';
        
        // Create leaderboard tabs
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
            if (tab.id === this.currentLeaderboard) {
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
                this.setLeaderboardType(tab.id);
                this.updateLeaderboardTable();
            });
            
            tabsContainer.appendChild(tabButton);
        });
        
        leaderboardContainer.appendChild(tabsContainer);
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'leaderboard-table-container';
        leaderboardContainer.appendChild(tableContainer);
        
        // Update the table with current leaderboard data
        this.updateLeaderboardTable();
    }
    
    // Update just the table part of the leaderboard
    updateLeaderboardTable() {
        const tableContainer = document.querySelector('.leaderboard-table-container');
        if (!tableContainer) return;
        
        // Clear existing table
        tableContainer.innerHTML = '';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Add header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Country</th>
                <th>Score</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Add body
        const tbody = document.createElement('tbody');
        const scores = this.getTopScores();
        
        if (scores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" style="text-align: center;">No scores yet. Be the first!</td>
            `;
            tbody.appendChild(row);
        } else {
            scores.forEach((score, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${score.name}</td>
                    <td>${this.getCountryFlag(score.country)}</td>
                    <td>${score.score}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        
        // Add reset time information
        const resetInfo = document.createElement('div');
        resetInfo.className = 'reset-info';
        
        let resetText = '';
        switch (this.currentLeaderboard) {
            case 'daily':
                resetText = `Daily leaderboard resets at midnight EST`;
                break;
            case 'weekly':
                resetText = `Weekly leaderboard resets every Monday at midnight EST`;
                break;
            default:
                resetText = 'All-time leaderboard never resets';
        }
        
        resetInfo.textContent = resetText;
        tableContainer.appendChild(resetInfo);
    }
    
    // Helper to convert country code to flag emoji
    getCountryFlag(countryCode) {
        if (!countryCode || countryCode === 'XX') return '🏳️';
        
        // Convert country code to flag emoji
        return countryCode
            .toUpperCase()
            .split('')
            .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            .join('');
    }
    
    // Submit a test score
    submitTestScore() {
        const testScore = Math.floor(Math.random() * 500) + 100; // Random score between 100-600
        const testName = "TST";
        const testCountry = "XX";
        
        console.log(`Submitting test score: ${testScore}`);
        
        return this.submitScore(testName, testCountry, testScore)
            .then(success => {
                if (success) {
                    console.log("Test score submitted successfully!");
                    alert(`Test score of ${testScore} submitted successfully!`);
                    return true;
                } else {
                    console.error("Failed to submit test score");
                    alert("Failed to submit test score");
                    return false;
                }
            })
            .catch(error => {
                console.error("Error submitting test score:", error);
                alert(`Error submitting test score: ${error.message}`);
                return false;
            });
    }
    
    // Check if leaderboards need to be reset
    async checkAndResetLeaderboards() {
        try {
            // Get last reset timestamps
            const timestampsRef = this.db.ref('resetTimestamps');
            const snapshot = await timestampsRef.once('value');
            const timestamps = snapshot.val() || {};
            
            const now = new Date();
            const currentTime = now.getTime();
            
            // Check daily reset (midnight EST)
            await this.checkDailyReset(timestamps, currentTime);
            
            // Check weekly reset (Monday midnight EST)
            await this.checkWeeklyReset(timestamps, currentTime);
            
            return true;
        } catch (error) {
            console.error("Error checking leaderboard resets:", error);
            return false;
        }
    }
    
    // Check and perform daily reset if needed
    async checkDailyReset(timestamps, currentTime) {
        const lastDailyReset = timestamps.daily || 0;
        
        // Convert current time to EST
        const nowEST = new Date(currentTime);
        nowEST.setHours(nowEST.getHours() - 5); // Rough EST conversion
        
        // Get start of today in EST
        const todayEST = new Date(nowEST);
        todayEST.setHours(0, 0, 0, 0);
        
        // If last reset was before today's start, reset daily leaderboard
        if (lastDailyReset < todayEST.getTime()) {
            console.log("Performing daily leaderboard reset");
            
            // Clear daily leaderboard
            await this.dailyScoresRef.remove();
            
            // Update reset timestamp
            await this.db.ref('resetTimestamps/daily').set(currentTime);
            
            // Clear local cache
            this.topScores.daily = [];
        }
    }
    
    // Check and perform weekly reset if needed
    async checkWeeklyReset(timestamps, currentTime) {
        const lastWeeklyReset = timestamps.weekly || 0;
        
        // Convert current time to EST
        const nowEST = new Date(currentTime);
        nowEST.setHours(nowEST.getHours() - 5); // Rough EST conversion
        
        // Get day of week (0 = Sunday, 1 = Monday)
        const dayOfWeek = nowEST.getDay();
        
        // If today is Monday (day 1) and last reset was before today
        if (dayOfWeek === 1) {
            // Get start of today in EST
            const todayEST = new Date(nowEST);
            todayEST.setHours(0, 0, 0, 0);
            
            // If last reset was before today's start, reset weekly leaderboard
            if (lastWeeklyReset < todayEST.getTime()) {
                console.log("Performing weekly leaderboard reset");
                
                // Clear weekly leaderboard
                await this.weeklyScoresRef.remove();
                
                // Update reset timestamp
                await this.db.ref('resetTimestamps/weekly').set(currentTime);
                
                // Clear local cache
                this.topScores.weekly = [];
            }
        }
    }
} 