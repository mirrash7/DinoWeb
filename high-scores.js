class HighScoreManager {
    constructor() {
        // Initialize Firebase (you'll need to replace this with your own Firebase config)
        const firebaseConfig = {
            apiKey: "AIzaSyCikYxp5FlVgfYU4eDRNUDiDNwWdpZtzfg",
            authDomain: "dino-web-7034b.firebaseapp.com",
            projectId: "dino-web-7034b",
            storageBucket: "dino-web-7034b.firebasestorage.app",
            messagingSenderId: "1027476024824",
            appId: "1:1027476024824:web:5c3cf4367bfd6215463a0d",
            measurementId: "G-HTYP6DE5D7"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        this.scoresRef = this.db.ref('scores');
        
        // Cache for top scores
        this.topScores = [];
        
        // Load scores immediately
        this.loadTopScores();
    }
    
    // Submit a new score
    async submitScore(playerName, country, score) {
        if (!playerName || !score) return false;
        
        try {
            // Add timestamp for sorting by recency if needed
            const timestamp = Date.now();
            
            // Create a new score entry
            await this.scoresRef.push({
                name: playerName.substring(0, 3).toUpperCase(), // Limit to 3 chars
                country: country || 'XX',
                score: score,
                timestamp: timestamp
            });
            
            // Reload top scores after submission
            await this.loadTopScores();
            return true;
        } catch (error) {
            console.error("Error submitting score:", error);
            return false;
        }
    }
    
    // Load top 10 scores
    async loadTopScores() {
        try {
            // Get top 10 scores ordered by score (descending)
            const snapshot = await this.scoresRef
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
            this.topScores = scores.sort((a, b) => b.score - a.score);
            
            return this.topScores;
        } catch (error) {
            console.error("Error loading scores:", error);
            return [];
        }
    }
    
    // Get cached top scores
    getTopScores() {
        return this.topScores;
    }
    
    // Check if a score qualifies for the leaderboard
    isHighScore(score) {
        if (this.topScores.length < 10) return true;
        return score > this.topScores[this.topScores.length - 1].score;
    }
    
    // Display scores in the settings panel
    updateLeaderboardDisplay() {
        const leaderboardContainer = document.querySelector('.leaderboard-content');
        if (!leaderboardContainer) return;
        
        // Clear existing content
        leaderboardContainer.innerHTML = '';
        
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
        
        if (this.topScores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" style="text-align: center;">No scores yet. Be the first!</td>
            `;
            tbody.appendChild(row);
        } else {
            this.topScores.forEach((score, index) => {
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
        leaderboardContainer.appendChild(table);
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
} 