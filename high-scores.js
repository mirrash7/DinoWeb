class HighScoreManager {
    constructor() {
        // Base URL for our API endpoints
        this.apiBaseUrl = 'https://dinoweb-api.vercel.app/api'; // Replace with your actual API URL
        
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
            const response = await fetch(`${this.apiBaseUrl}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerName.substring(0, 3).toUpperCase(), // Limit to 3 chars
                    country: country || 'XX',
                    score: score,
                    timestamp: timestamp
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to submit score: ${response.statusText}`);
            }
            
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
            const response = await fetch(`${this.apiBaseUrl}/scores`);
            
            if (!response.ok) {
                throw new Error(`Failed to load scores: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Sort by score (highest first)
            this.topScores = data.sort((a, b) => b.score - a.score).slice(0, 10);
            
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