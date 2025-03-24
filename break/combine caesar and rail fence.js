export class CipherBreaker {
    constructor() {
        this.englishFrequencies = {
            'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0,
            'N': 6.7, 'S': 6.3, 'H': 6.1, 'R': 6.0, 'D': 4.3,
            'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4, 'W': 2.4,
            'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5,
            'V': 1.0, 'K': 0.8, 'J': 0.15, 'X': 0.15, 'Q': 0.10, 'Z': 0.07
        };
        
        // Expanded common words list
        this.commonWords = new Set([
            // Articles and basic words
            'THE', 'A', 'AN', 'AND', 'OR', 'BUT',
            
            // Pronouns
            'I', 'YOU', 'HE', 'SHE', 'IT', 'WE', 'THEY',
            'ME', 'HIM', 'HER', 'US', 'THEM',
            'MY', 'YOUR', 'HIS', 'ITS', 'OUR', 'THEIR',
            'MINE', 'YOURS', 'HERS', 'OURS', 'THEIRS',
            'THIS', 'THAT', 'THESE', 'THOSE',
            'WHO', 'WHOM', 'WHOSE', 'WHICH', 'WHAT',
            
            // Prepositions
            'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH',
            'BY', 'FROM', 'UP', 'DOWN', 'INTO', 'ONTO',
            'OVER', 'UNDER', 'ABOVE', 'BELOW',
            
            // Verbs (common forms)
            'IS', 'ARE', 'WAS', 'WERE', 'BE', 'BEEN', 'BEING',
            'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID',
            'GO', 'GOES', 'WENT', 'GONE',
            'MAKE', 'MAKES', 'MADE',
            'TAKE', 'TAKES', 'TOOK',
            'SEE', 'SEES', 'SAW',
            'KNOW', 'KNOWS', 'KNEW',
            'GET', 'GETS', 'GOT',
            'WILL', 'WOULD', 'CAN', 'COULD',
            'SHALL', 'SHOULD', 'MAY', 'MIGHT',
            'MUST', 'OUGHT',
            
            // Common adjectives
            'GOOD', 'BAD', 'BIG', 'SMALL',
            'HIGH', 'LOW', 'OLD', 'NEW',
            'FIRST', 'LAST', 'LONG', 'SHORT',
            'OWN', 'SAME', 'RIGHT', 'LEFT',
            'NEXT', 'EARLY', 'LATE', 'FAR',
            
            // Time words
            'NOW', 'THEN', 'TODAY', 'TOMORROW',
            'YESTERDAY', 'YEAR', 'MONTH', 'WEEK',
            'DAY', 'TIME', 'HOUR', 'MINUTE',
            
            // Numbers and quantities
            'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
            'TEN', 'MANY', 'MUCH', 'SOME', 'ANY',
            'ALL', 'BOTH', 'HALF', 'NONE',
            
            // Question words
            'WHY', 'WHERE', 'WHEN', 'HOW',
            
            // Common nouns
            'MAN', 'WOMAN', 'CHILD', 'PERSON',
            'PEOPLE', 'THING', 'WAY', 'LIFE',
            'WORLD', 'SCHOOL', 'WORK', 'HOME',
            'ROOM', 'HOUSE', 'PLACE', 'CASE',
            'GROUP', 'COMPANY', 'NUMBER', 'PART',
            
            // Other common words
            'YES', 'NO', 'NOT', 'VERY', 'JUST',
            'LIKE', 'WELL', 'ONLY', 'EVEN', 'BACK',
            'THERE', 'HERE', 'WHERE', 'WHEN',
            'ABOUT', 'AFTER', 'BEFORE', 'BETWEEN'
        ]);
    }

    // Caesar Cipher Methods
    decryptCaesar(text, shift) {
        let result = '';
        const upperText = text.toUpperCase();
        for (let char of upperText) {
            if (/[A-Z]/.test(char)) {
                result += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            } else {
                result += char;
            }
        }
        return result;
    }

    // Rail Fence Methods
    decryptRailFence(text, rails) {
        if (rails < 2) return text;
        const len = text.length;
        const fence = Array(rails).fill().map(() => Array(len).fill('\n'));
        
        let rail = 0, direction = 1;
        for (let i = 0; i < len; i++) {
            fence[rail][i] = '*';
            rail += direction;
            if (rail === rails - 1 || rail === 0) direction = -direction;
        }
        
        let index = 0;
        for (let i = 0; i < rails; i++) {
            for (let j = 0; j < len; j++) {
                if (fence[i][j] === '*' && index < len) {
                    fence[i][j] = text[index++];
                }
            }
        }
        
        let result = '';
        rail = 0;
        direction = 1;
        for (let i = 0; i < len; i++) {
            result += fence[rail][i];
            rail += direction;
            if (rail === rails - 1 || rail === 0) direction = -direction;
        }
        return result;
    }

    // Scoring Method
    scoreText(text, method = null) {
        if (!text) return Number.NEGATIVE_INFINITY;

        // Calculate letter frequencies
        const freq = {};
        let total = 0;
        for (let char of text) {
            if (/[A-Z]/.test(char)) {
                freq[char] = (freq[char] || 0) + 1;
                total++;
            }
        }

        if (total === 0) return Number.NEGATIVE_INFINITY;

        // Score based on letter frequencies
        let freqScore = 0;
        for (let char in freq) {
            const observedFreq = (freq[char] / total) * 100;
            const expectedFreq = this.englishFrequencies[char] || 0;
            freqScore -= Math.abs(observedFreq - expectedFreq);
        }

        // Score based on common words
        const words = text.split(/\s+/);
        let wordScore = 0;
        let consecutiveWordBonus = 0;

        for (let word of words) {
            word = word.toUpperCase();
            // Full word matches
            if (this.commonWords.has(word)) {
                wordScore += 20;  // Increased score for exact matches
                consecutiveWordBonus += 5;
            } else {
                // Check for common word endings
                if (word.length > 3) {
                    const commonEndings = ['ING', 'ED', 'LY', 'ION', 'TION', 'MENT'];
                    if (commonEndings.some(ending => word.endsWith(ending))) {
                        wordScore += 10;
                    }
                }
            }
        }

        // Additional scoring for Caesar-specific patterns
        let methodScore = 0;
        if (method === 'Caesar') {
            // Check for common word patterns in Caesar cipher
            const text_str = text.toString().toUpperCase();
            if (text_str.includes('THE') || text_str.includes('AND') || 
                text_str.includes('ING') || text_str.includes('ION')) {
                methodScore += 30;
            }
            
            // Check for proper word lengths (Caesar usually maintains word structure)
            const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
            if (avgWordLength >= 3 && avgWordLength <= 7) {  // typical English word length
                methodScore += 20;
            }
        }

        // Final score calculation with adjusted weights
        let finalScore = (freqScore * 0.4) + (wordScore * 1.2) + (consecutiveWordBonus * 0.6) + methodScore;

        // Adjust scoring based on cipher type
        if (method === 'Caesar') {
            finalScore *= 1.3;  // Boost Caesar scores
        } else if (method === 'Rail Fence' && text.includes(' ')) {
            finalScore *= 1.1;  // Slight boost for Rail Fence with spaces
        }

        return finalScore;
    }

    // Breaking Methods
    breakCaesar(ciphertext) {
        const results = [];
        for (let shift = 0; shift < 26; shift++) {
            const decrypted = this.decryptCaesar(ciphertext, shift);
            results.push({
                method: 'Caesar',
                shift: shift,
                text: decrypted,
                score: this.scoreText(decrypted, 'Caesar')
            });
        }
        return results.sort((a, b) => b.score - a.score)[0];
    }

    breakRailFence(ciphertext, maxRails = 10) {
        const results = [];
        const text = ciphertext.toUpperCase();
        for (let rails = 2; rails <= maxRails; rails++) {
            const decrypted = this.decryptRailFence(text, rails);
            results.push({
                method: 'Rail Fence',
                rails: rails,
                text: decrypted,
                score: this.scoreText(decrypted, 'Rail Fence')
            });
        }
        return results.sort((a, b) => b.score - a.score)[0];
    }

    // Main breaking method
    breakCipher(ciphertext) {
        const caesarResult = this.breakCaesar(ciphertext);
        const railFenceResult = this.breakRailFence(ciphertext);

        console.log("\nDebug Scores:");
        console.log(`Caesar Score: ${caesarResult.score.toFixed(2)}`);
        console.log(`Rail Fence Score: ${railFenceResult.score.toFixed(2)}`);

        // Improved decision logic
        if (ciphertext.includes(' ')) {
            // For text with spaces, compare scores with bias
            if (caesarResult.score > railFenceResult.score * 1.4) {
                return caesarResult;
            }
            return railFenceResult;
        } else {
            // For text without spaces, prefer Caesar
            if (caesarResult.score * 0.8 > railFenceResult.score) {
                return caesarResult;
            }
            return railFenceResult;
        }
    }
}
