/**
 * Vigenere Cipher Breaker using Dictionary Attack
 * This script attempts to break a Vigenere cipher by trying English words as keys
 * and scoring the resulting plaintext for how likely it is to be valid English.
 */

import fs from 'node:fs';
import natural from 'natural';
import wordListPath from 'word-list';

export class VigenereBreaker {
    constructor() {
        // Move the dictionary loading into the constructor
        this.words = fs.readFileSync(wordListPath, 'utf8').split('\n');
        console.log(`Loaded ${this.words.length} words from dictionary`);
        
        // Initialize tokenizer as class property
        this.tokenizer = new natural.WordTokenizer();
    }

    // English letter frequency for scoring
    englishFrequency = {
        'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3, 'H': 6.1, 
        'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4, 'W': 2.4, 'F': 2.2, 
        'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5, 'V': 1.0, 'K': 0.8, 'J': 0.15, 'X': 0.15, 
        'Q': 0.10, 'Z': 0.07
    };

    // Common English words used to evaluate if a decryption is likely correct
    commonWords = [
        'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I', 'IT', 'FOR', 
        'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT', 'THIS', 'BUT', 'HIS', 'BY', 
        'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE', 'OR', 'AN', 'WILL', 'MY', 'ONE'
    ];

    /**
     * Decrypts a Vigenere cipher with a given key
     * @param {string} ciphertext - The text to decrypt
     * @param {string} key - The key to use for decryption
     * @returns {string} - The decrypted text
     */
    decryptVigenere(ciphertext, key) {
        let result = '';
        let keyIndex = 0;
        
        // Convert the key to uppercase
        key = key.toUpperCase();
        
        for (let i = 0; i < ciphertext.length; i++) {
            const char = ciphertext[i];
            
            // Only decrypt alphabetic characters
            if (/[A-Z]/i.test(char)) {
                // Get the character code (0-25)
                const charCode = char.toUpperCase().charCodeAt(0) - 65;
                const keyChar = key[keyIndex % key.length];
                const keyCode = keyChar.charCodeAt(0) - 65;
                
                // Vigenere decryption: (charCode - keyCode + 26) % 26
                const decryptedCode = (charCode - keyCode + 26) % 26;
                const decryptedChar = String.fromCharCode(decryptedCode + 65);
                
                // Add the decrypted character to the result
                result += (char === char.toUpperCase()) ? decryptedChar : decryptedChar.toLowerCase();
                
                // Move to the next key character
                keyIndex++;
            } else {
                // Non-alphabetic characters remain unchanged
                result += char;
            }
        }
        
        return result;
    }

    /**
     * Scores text based on English language characteristics
     * @param {string} text - The text to score
     * @returns {number} - A score representing how likely the text is English
     */
    scoreText(text) {
        // Convert to uppercase for analysis
        text = text.toUpperCase();
        
        // Score based on letter frequency
        let frequencyScore = 0;
        const letterCounts = {};
        let totalLetters = 0;
        
        // Count letter occurrences
        for (const char of text) {
            if (/[A-Z]/.test(char)) {
                letterCounts[char] = (letterCounts[char] || 0) + 1;
                totalLetters++;
            }
        }
        
        // Calculate frequency score
        if (totalLetters > 0) {
            for (const letter in this.englishFrequency) {
                const expected = this.englishFrequency[letter];
                const actual = ((letterCounts[letter] || 0) / totalLetters) * 100;
                // Lower difference is better
                frequencyScore += (100 - Math.abs(expected - actual));
            }
        }
        
        // Score based on common words
        let wordScore = 0;
        const words = this.tokenizer.tokenize(text) || [];
        
        // Count occurrences of common English words
        for (const word of words) {
            if (this.commonWords.includes(word.toUpperCase())) {
                // More weight for longer common words
                wordScore += word.length * 5;
            }
        }
        
        // Combine scores (weighted)
        return frequencyScore * 0.3 + wordScore * 0.7;
    }

    /**
     * Calculate Levenshtein distance between two words
     * @param {string} word1 - First word
     * @param {string} word2 - Second word
     * @returns {number} - Edit distance between words
     */
    levenshteinDistance(word1, word2) {
        const m = word1.length;
        const n = word2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (word1[i - 1] === word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + 1,
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
                }
            }
        }
        return dp[m][n];
    }

    /**
     * Find all near-miss words in a text
     * @param {string} text - Text to analyze
     * @param {Set} dictionary - Dictionary of valid words
     * @returns {Array} - Array of objects containing near-miss words and their corrections
     */
    findNearMissWords(text, dictionary) {
        const words = text.split(/\s+/);
        const nearMisses = [];
        
        for (const word of words) {
            if (word.length < 4) continue; // Skip short words
            
            let bestMatch = null;
            let minDistance = Infinity;
            
            for (const dictWord of dictionary) {
                if (Math.abs(word.length - dictWord.length) > 2) continue;
                
                const distance = this.levenshteinDistance(word.toUpperCase(), dictWord);
                if (distance > 0 && distance <= 2 && distance < minDistance) {
                    minDistance = distance;
                    bestMatch = dictWord;
                }
            }
            
            if (bestMatch) {
                nearMisses.push({
                    original: word,
                    correction: bestMatch,
                    position: text.indexOf(word),
                    distance: minDistance
                });
            }
        }
        
        return nearMisses;
    }

    /**
     * Enhanced refineKey function with flexible key length
     */
    refineKey(key, ciphertext, decrypted) {
        const dictionarySet = new Set([...this.commonWords, ...this.words.filter(w => w.length >= 4)]);
        const refinements = [];
        let bestKey = key;
        let bestScore = this.scoreText(decrypted);
        
        // Find near-miss words
        const nearMisses = this.findNearMissWords(decrypted, dictionarySet);
        
        if (nearMisses.length > 0) {
            // Try different key lengths around the original length
            const minLength = Math.max(3, key.length - 2);
            const maxLength = key.length + 2;
            
            // Try variations of the key with different lengths
            for (let newLength = minLength; newLength <= maxLength; newLength++) {
                // Extend key if needed
                let baseKey = key;
                while (baseKey.length < newLength) {
                    baseKey += key[baseKey.length % key.length];
                }
                // Truncate if needed
                baseKey = baseKey.slice(0, newLength);
                
                // Try substitutions for each position
                for (let pos = 0; pos < newLength; pos++) {
                    for (let c = 0; c < 26; c++) {
                        const newKey = baseKey.slice(0, pos) + 
                                     String.fromCharCode(65 + c) + 
                                     baseKey.slice(pos + 1);
                        
                        const newDecrypted = this.decryptVigenere(ciphertext, newKey);
                        const newScore = this.scoreText(newDecrypted);
                        const validation = this.validateDecryptedText(newDecrypted, dictionarySet);
                        
                        // Add significant score bonus for high word validity
                        const adjustedScore = newScore * (1 + validation.percentage / 100);
                        
                        refinements.push({
                            key: newKey,
                            score: adjustedScore,
                            decrypted: newDecrypted,
                            validation,
                            type: newLength === key.length ? 'substitution' : 
                                  newLength > key.length ? 'extension' : 'reduction'
                        });
                    }
                }
                
                // Try inserting new letters
                if (newLength > key.length) {
                    for (let pos = 0; pos <= baseKey.length; pos++) {
                        for (let c = 0; c < 26; c++) {
                            const newKey = baseKey.slice(0, pos) + 
                                         String.fromCharCode(65 + c) + 
                                         baseKey.slice(pos);
                            
                            const newDecrypted = this.decryptVigenere(ciphertext, newKey);
                            const newScore = this.scoreText(newDecrypted);
                            const validation = this.validateDecryptedText(newDecrypted, dictionarySet);
                            
                            refinements.push({
                                key: newKey,
                                score: newScore * (1 + validation.percentage / 100),
                                decrypted: newDecrypted,
                                validation,
                                type: 'insertion'
                            });
                        }
                    }
                }
            }
            
            // Try pattern-based extensions
            const patterns = [
                key + key[0],              // Repeat first letter
                key + key.slice(-1),       // Repeat last letter
                key + key,                 // Double the key
                key.slice(0, -1),          // Remove last letter
                key.slice(1)               // Remove first letter
            ];
            
            for (const pattern of patterns) {
                const newDecrypted = this.decryptVigenere(ciphertext, pattern);
                const newScore = this.scoreText(newDecrypted);
                const validation = this.validateDecryptedText(newDecrypted, dictionarySet);
                
                refinements.push({
                    key: pattern,
                    score: newScore * (1 + validation.percentage / 100),
                    decrypted: newDecrypted,
                    validation,
                    type: 'pattern'
                });
            }
        }
        
        // Find the best refinement
        if (refinements.length > 0) {
            // Sort by score and validation percentage
            refinements.sort((a, b) => {
                if (a.validation.isValid && !b.validation.isValid) return -1;
                if (!a.validation.isValid && b.validation.isValid) return 1;
                return b.score - a.score;
            });
            
            const best = refinements[0];
            
            // Only accept refinement if it's significantly better
            const improvement = (best.score - bestScore) / bestScore;
            if (best.validation.isValid || improvement > 0.1) {
                return {
                    key: best.key,
                    score: best.score,
                    decrypted: best.decrypted,
                    validation: best.validation,
                    type: best.type,
                    originalLength: key.length,
                    lengthDelta: best.key.length - key.length
                };
            }
        }
        
        // Return original if no better refinement found
        return {
            key,
            score: bestScore,
            decrypted,
            validation: this.validateDecryptedText(decrypted, dictionarySet),
            type: 'none',
            originalLength: key.length,
            lengthDelta: 0
        };
    }

    /**
     * Determines if a decryption is satisfactory based on scoring
     * @param {string} decrypted - The decrypted text
     * @param {number} score - The score of the decryption
     * @returns {boolean} - True if the decryption meets quality threshold
     */
    isDecryptionSatisfactory(decrypted, score) {
        // Check score threshold
        if (score < 700) return false;
        
        // Check for a minimum percentage of valid words
        const words = decrypted.split(/\s+/);
        const validWords = words.filter(word => 
            word.length >= 4 && this.commonWords.includes(word.toUpperCase())
        );
        
        return (validWords.length / words.length) >= 0.3;
    }

    /**
     * Attempts to recover missing letters in a candidate key
     * @param {string} key - The candidate key to refine
     * @param {string} ciphertext - The encrypted text
     * @param {string} decrypted - Current decryption
     * @returns {Object} - Object containing refined key and decryption info
     */
    recoverMissingLetters(key, ciphertext, decrypted) {
        const refinements = [];
        let bestKey = key;
        let bestScore = this.scoreText(decrypted);
        
        // Try inserting letters at each position
        for (let pos = 0; pos <= key.length; pos++) {
            for (let c = 0; c < 26; c++) {
                const newKey = key.slice(0, pos) + 
                             String.fromCharCode(65 + c) + 
                             key.slice(pos);
                
                const newDecrypted = this.decryptVigenere(ciphertext, newKey);
                const newScore = this.scoreText(newDecrypted);
                
                if (newScore > bestScore) {
                    bestKey = newKey;
                    bestScore = newScore;
                    refinements.push({
                        key: newKey,
                        score: newScore,
                        decrypted: newDecrypted,
                        type: 'insertion'
                    });
                }
            }
        }
        
        // Try substituting letters at each position
        for (let pos = 0; pos < key.length; pos++) {
            for (let c = 0; c < 26; c++) {
                const newKey = key.slice(0, pos) + 
                             String.fromCharCode(65 + c) + 
                             key.slice(pos + 1);
                
                const newDecrypted = this.decryptVigenere(ciphertext, newKey);
                const newScore = this.scoreText(newDecrypted);
                
                if (newScore > bestScore) {
                    bestKey = newKey;
                    bestScore = newScore;
                    refinements.push({
                        key: newKey,
                        score: newScore,
                        decrypted: newDecrypted,
                        type: 'substitution'
                    });
                }
            }
        }
        
        // Try duplicating the last letter
        const duplicatedKey = key + key[key.length - 1];
        const duplicatedDecrypted = this.decryptVigenere(ciphertext, duplicatedKey);
        const duplicatedScore = this.scoreText(duplicatedDecrypted);
        
        if (duplicatedScore > bestScore) {
            refinements.push({
                key: duplicatedKey,
                score: duplicatedScore,
                decrypted: duplicatedDecrypted,
                type: 'duplication'
            });
        }
        
        // Return the best refinement or original if no improvement found
        if (refinements.length > 0) {
            refinements.sort((a, b) => b.score - a.score);
            return refinements[0];
        }
        
        return { key, score: bestScore, decrypted, type: 'none' };
    }

    /**
     * Creates a dictionary set for word validation
     * @returns {Set} Set of valid English words
     */
    createDictionarySet() {
        // Combine common words and dictionary words
        return new Set([
            ...this.commonWords,
            ...this.words.filter(w => w.length >= 2).map(w => w.toUpperCase())
        ]);
    }

    /**
     * Validates if text contains only dictionary words
     * @param {string} text - Text to validate
     * @param {Set} dictionary - Set of valid words
     * @returns {Object} Validation result with percentage and invalid words
     */
    validateDecryptedText(text, dictionary) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const invalidWords = [];
        let validCount = 0;
        
        for (const word of words) {
            // Remove punctuation and convert to uppercase
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
            if (cleanWord.length === 0) continue;
            
            if (dictionary.has(cleanWord)) {
                validCount++;
            } else {
                invalidWords.push(word);
            }
        }
        
        const percentage = words.length > 0 ? (validCount / words.length) * 100 : 0;
        return {
            isValid: percentage >= 90, // Consider valid if 90% or more words are recognized
            percentage,
            invalidWords
        };
    }

    /**
     * Estimates the likely key length using Index of Coincidence
     * @param {string} ciphertext - The encrypted text
     * @returns {number[]} - Array of probable key lengths, sorted by likelihood
     */
    estimateKeyLength(ciphertext) {
        const maxLength = 12; // Maximum key length to consider
        const scores = [];
        
        // Calculate IC for different key lengths
        for (let length = 2; length <= maxLength; length++) {
            let avgIC = 0;
            
            // Split text into sequences
            for (let offset = 0; offset < length; offset++) {
                const sequence = [];
                for (let i = offset; i < ciphertext.length; i += length) {
                    if (/[A-Z]/i.test(ciphertext[i])) {
                        sequence.push(ciphertext[i].toUpperCase());
                    }
                }
                
                // Calculate IC for this sequence
                const freqs = new Array(26).fill(0);
                for (const char of sequence) {
                    freqs[char.charCodeAt(0) - 65]++;
                }
                
                let ic = 0;
                const n = sequence.length;
                for (const freq of freqs) {
                    ic += (freq * (freq - 1)) / (n * (n - 1));
                }
                avgIC += ic;
            }
            avgIC /= length;
            
            scores.push({ length, score: avgIC });
        }
        
        // Sort by IC score (higher is better)
        scores.sort((a, b) => b.score - a.score);
        return scores.map(s => s.length);
    }

    /**
     * Generates systematic key variations for brute force approach
     * @param {number} length - Target key length
     * @param {string} baseKey - Optional base key to start from
     * @yields {string} - Next key to try
     */
    *generateSystematicKeys(length, baseKey = '') {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // If we have a base key, try variations first
        if (baseKey) {
            // Try changing one letter at a time
            for (let pos = 0; pos < length; pos++) {
                for (const letter of alphabet) {
                    const newKey = baseKey.padEnd(length, 'A');
                    yield newKey.slice(0, pos) + letter + newKey.slice(pos + 1);
                }
            }
        }
        
        // Generate completely new keys systematically
        // (This is a simplified version - you might want to limit the combinations)
        function* generateRecursive(prefix) {
            if (prefix.length === length) {
                yield prefix;
                return;
            }
            
            for (const letter of alphabet) {
                yield* generateRecursive(prefix + letter);
            }
        }
        
        yield* generateRecursive('');
    }

    /**
     * Modified breakVigenere function with random key handling
     */
    async breakVigenere(ciphertext) {
        console.log("Initializing dictionary set...");
        const dictionarySet = this.createDictionarySet();
        
        console.log("Step 1: Trying dictionary attack...");
        const candidates = [];
        const shortWords = this.words.filter(word => word.length >= 3 && word.length <= 10);
        const totalWords = shortWords.length;
        
        // Progress tracking
        let processedCount = 0;
        const progressInterval = 500;
        const startTime = Date.now();
        
        // Step 1: Dictionary Attack with validation
        for (const word of shortWords) {
            if (word.length < 1) continue;
            
            const decryption = this.decryptVigenere(ciphertext, word);
            const validation = this.validateDecryptedText(decryption, dictionarySet);
            const score = this.scoreText(decryption);
            
            // Store validation results with candidate
            candidates.push({
                key: word,
                decrypted: decryption,
                score: score,
                validation,
                refined: false
            });
            
            // If we found a highly valid decryption, log it
            if (validation.isValid) {
                console.log(`\nFound potentially valid decryption with key "${word}":`);
                console.log(`Decrypted: "${decryption}"`);
                console.log(`Valid words: ${validation.percentage.toFixed(1)}%`);
            }
            
            // Progress update
            processedCount++;
            if (processedCount % progressInterval === 0) {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const percentComplete = ((processedCount / totalWords) * 100).toFixed(1);
                console.log(
                    `Dictionary attack progress: ${percentComplete}% (${processedCount.toLocaleString()} keys)`
                );
            }
        }
        
        // Sort candidates by score and validation percentage
        candidates.sort((a, b) => {
            if (a.validation.isValid && !b.validation.isValid) return -1;
            if (!a.validation.isValid && b.validation.isValid) return 1;
            return b.score - a.score;
        });
        
        // Check if we found any valid solutions
        const validCandidates = candidates.filter(c => c.validation.isValid);
        if (validCandidates.length > 0) {
            console.log("\nFound valid solutions without need for refinement!");
            return validCandidates[0];
        }
        
        // Check if dictionary attack was successful
        const bestDictionaryCandidate = candidates[0];
        const dictionaryAttackSuccessful = bestDictionaryCandidate.score > 700 && 
                                         bestDictionaryCandidate.validation.percentage > 70;
        
        if (!dictionaryAttackSuccessful) {
            console.log("\nDictionary attack unsuccessful. Switching to systematic key search...");
            
            // Estimate likely key lengths
            const likelyLengths = this.estimateKeyLength(ciphertext);
            console.log(`Estimated likely key lengths: ${likelyLengths.slice(0, 3).join(', ')}...`);
            
            // Try systematic key generation for most likely lengths
            const systematicCandidates = [];
            const maxTriesPerLength = 10000; // Limit tries to prevent infinite loops
            let totalTries = 0;
            
            for (const length of likelyLengths.slice(0, 3)) { // Try top 3 likely lengths
                console.log(`\nTrying systematic keys of length ${length}...`);
                let triesForThisLength = 0;
                
                // Start with variations of best dictionary candidates
                const baseKeys = candidates
                    .slice(0, 3)
                    .map(c => c.key)
                    .filter(k => Math.abs(k.length - length) <= 2);
                
                for (const baseKey of baseKeys) {
                    for (const key of this.generateSystematicKeys(length, baseKey)) {
                        const decryption = this.decryptVigenere(ciphertext, key);
                        const validation = this.validateDecryptedText(decryption, dictionarySet);
                        const score = this.scoreText(decryption);
                        
                        systematicCandidates.push({
                            key,
                            decrypted: decryption,
                            score,
                            validation,
                            method: 'systematic'
                        });
                        
                        triesForThisLength++;
                        totalTries++;
                        
                        if (totalTries % 500 === 0) {
                            console.log(`Tried ${totalTries} systematic keys...`);
                        }
                        
                        // Stop if we find a very good candidate
                        if (score > 800 && validation.percentage > 80) {
                            console.log(`Found promising systematic key: ${key}`);
                            break;
                        }
                        
                        if (triesForThisLength >= maxTriesPerLength) break;
                    }
                    
                    if (triesForThisLength >= maxTriesPerLength) break;
                }
            }
            
            // Combine and sort all candidates
            const allCandidates = [...systematicCandidates, ...candidates];
            allCandidates.sort((a, b) => b.score - a.score);
            
            // Display results
            console.log("\nTop 10 potential keys (including systematic search):");
            console.log("===============================================");
            
            for (let i = 0; i < Math.min(10, allCandidates.length); i++) {
                const candidate = allCandidates[i];
                console.log(`${i+1}. Key: "${candidate.key}" (${candidate.method || 'dictionary'})`);
                console.log(`   Score: ${candidate.score.toFixed(2)}`);
                console.log(`   Valid words: ${candidate.validation.percentage.toFixed(1)}%`);
                if (!candidate.validation.isValid) {
                    console.log(`   Invalid words: ${candidate.validation.invalidWords.join(', ')}`);
                }
                console.log(`   Decrypted: "${candidate.decrypted}"`);
                console.log();
            }
            
            return allCandidates[0];
        }
        
        // If dictionary attack was successful, continue with original code
        // ... [Rest of the original code remains the same]
    }
}