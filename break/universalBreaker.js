/**
 * Universal Cipher Breaker - Integration Module
 * Combines Vigenère, Caesar, and Rail Fence cipher breaking capabilities
 * into a unified system that automatically detects and decrypts ciphered text.
 */

import { VigenereBreaker } from './vigenere.js';
import { CipherBreaker } from './combine caesar and rail fence.js';

// This is now the only place where the ciphertext is defined
const CIPHERTEXT = "Kw ft ail cewiaqvi tmcyqlgerxtt bq jyn, am etfrt bb qp tgeamz, vyyi ba, ja jm raivizlv mpm qibtk wn vyc axbbgiq dy bpg rjeaijgk, rwtb vqk y lhzl efsaw jm orbt hcb.";

class UniversalCipherBreaker {
    constructor() {
        this.vigenereBreaker = new VigenereBreaker();
        this.classicBreaker = new CipherBreaker();
        
        // Adjusted scoring weights to favor simpler methods when they produce valid results
        this.scoreWeights = {
            caesar: 1.2,      // Increased weight for Caesar when clear text is found
            railFence: 0.7,   // Lower weight for Rail Fence
            vigenere: 0.9     // Slightly reduced weight for Vigenère to prevent false positives
        };

        // Thresholds for valid decryption
        this.thresholds = {
            validWordPercentage: 40,
            minimumScore: 50
        };
    }

    normalizeScore(method, rawScore, options = {}) {
        // Handle invalid inputs
        if (typeof rawScore !== 'number' || isNaN(rawScore)) {
            console.debug(`Warning: Invalid raw score for ${method}. Defaulting to 0.`);
            return 0;
        }

        try {
            // Base normalization (scale from typical range to 0-1)
            let normalizedScore = Math.max(0, rawScore) / 1000;
            
            // Apply method-specific weights
            normalizedScore *= (this.scoreWeights[method] || 1.0);

            // Word validation bonus
            if (options.validWordPercentage) {
                const wordScore = Math.max(0, Math.min(100, options.validWordPercentage)) / 100;
                normalizedScore *= (0.3 + 0.7 * wordScore);
            }

            // Structure preservation bonus
            if (options.preservesSpaces) {
                normalizedScore *= 1.2;
            }

            return Math.max(0, Math.min(1, normalizedScore));
        } catch (error) {
            console.debug(`Error normalizing score for ${method}:`, error);
            return 0;
        }
    }

    async breakCipher(ciphertext) {
        if (!ciphertext || typeof ciphertext !== 'string') {
            throw new Error('Invalid ciphertext provided');
        }

        console.log("\n=== Starting Universal Cipher Analysis ===");
        console.log(`Input text: "${ciphertext}"\n`);
        
        const results = [];
        
        // Try Caesar cipher first
        console.log("Attempting Caesar cipher decryption...");
        try {
            const caesarResult = this.classicBreaker.breakCaesar(ciphertext);
            
            // Ensure caesarResult has the required properties
            if (caesarResult && caesarResult.text && typeof caesarResult.shift === 'number') {
                const normalizedScore = this.normalizeScore('caesar', caesarResult.score, {
                    preservesSpaces: true
                });

                results.push({
                    method: 'Caesar',
                    key: caesarResult.shift,
                    decrypted: caesarResult.text,
                    rawScore: caesarResult.score,
                    normalizedScore,
                    additionalInfo: {
                        shiftValue: caesarResult.shift
                    }
                });

                console.log(`Caesar analysis complete:`);
                console.log(`  Shift: ${caesarResult.shift}`);
                console.log(`  Raw score: ${caesarResult.score.toFixed(2)}`);
                console.log(`  Normalized score: ${normalizedScore.toFixed(3)}`);
                console.log(`  Sample: "${caesarResult.text.substring(0, 50)}..."\n`);
            } else {
                throw new Error('Invalid Caesar result structure');
            }
        } catch (error) {
            console.log("Warning: Caesar decryption failed:", error.message);
        }

        // Try Rail Fence if Caesar score isn't conclusive
        const bestCaesarScore = results[0]?.normalizedScore || 0;
        if (bestCaesarScore < 0.7) {
            console.log("Attempting Rail Fence decryption...");
            try {
                const railFenceResult = this.classicBreaker.breakRailFence(ciphertext);
                
                if (railFenceResult && railFenceResult.text) {
                    const normalizedScore = this.normalizeScore('railFence', railFenceResult.score, {
                        preservesSpaces: true
                    });

                    results.push({
                        method: 'Rail Fence',
                        key: railFenceResult.rails,
                        decrypted: railFenceResult.text,
                        rawScore: railFenceResult.score,
                        normalizedScore,
                        additionalInfo: {
                            rails: railFenceResult.rails
                        }
                    });

                    console.log(`Rail Fence analysis complete:`);
                    console.log(`  Rails: ${railFenceResult.rails}`);
                    console.log(`  Raw score: ${railFenceResult.score.toFixed(2)}`);
                    console.log(`  Normalized score: ${normalizedScore.toFixed(3)}\n`);
                }
            } catch (error) {
                console.log("Warning: Rail Fence decryption failed:", error.message);
            }
        }

        // Try Vigenère only if simpler methods don't yield good results
        const bestSimpleScore = Math.max(...results.map(r => r.normalizedScore));
        if (bestSimpleScore < 0.6) {
            try {
                console.log("Attempting Vigenère decryption...");
                const vigenereResult = await this.vigenereBreaker.breakVigenere(ciphertext);
                
                if (vigenereResult && vigenereResult.decrypted) {
                    const normalizedScore = this.normalizeScore('vigenere', vigenereResult.score, {
                        validWordPercentage: vigenereResult.validation?.percentage,
                        preservesSpaces: true
                    });

                    results.push({
                        method: 'Vigenère',
                        key: vigenereResult.key,
                        decrypted: vigenereResult.decrypted,
                        rawScore: vigenereResult.score,
                        normalizedScore,
                        additionalInfo: {
                            validWordPercentage: vigenereResult.validation?.percentage,
                            invalidWords: vigenereResult.validation?.invalidWords
                        }
                    });

                    console.log(`Vigenère analysis complete:`);
                    console.log(`  Key: ${vigenereResult.key}`);
                    console.log(`  Raw score: ${vigenereResult.score.toFixed(2)}`);
                    console.log(`  Normalized score: ${normalizedScore.toFixed(3)}`);
                    console.log(`  Valid words: ${vigenereResult.validation?.percentage.toFixed(1)}%\n`);
                }
            } catch (error) {
                console.log("Warning: Vigenère decryption failed:", error.message);
            }
        }

        // Filter and sort results
        const validResults = results
            .filter(r => r.normalizedScore >= 0.1)
            .sort((a, b) => b.normalizedScore - a.normalizedScore);

        if (validResults.length === 0) {
            throw new Error('No valid decryption results found');
        }

        // Display final results
        this.displayResults(validResults);

        return validResults[0];
    }

    displayResults(results) {
        console.log("\n=== Final Analysis Results ===");
        console.log("Ranked by confidence score:\n");

        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.method} Cipher`);
            console.log(`   Key: ${this.formatKey(result)}`);
            console.log(`   Confidence: ${(result.normalizedScore * 100).toFixed(1)}%`);
            console.log(`   Raw Score: ${result.rawScore.toFixed(2)}`);
            
            if (result.additionalInfo?.validWordPercentage) {
                console.log(`   Valid Words: ${result.additionalInfo.validWordPercentage.toFixed(1)}%`);
            }
            
            console.log(`   Decrypted Text:`);
            console.log(`   "${result.decrypted}"`);
            console.log();
        });
    }

    formatKey(result) {
        switch (result.method) {
            case 'Caesar':
                return `Shift ${result.key}`;
            case 'Rail Fence':
                return `${result.key} rails`;
            case 'Vigenère':
                return `"${result.key}"`;
            default:
                return String(result.key);
        }
    }
}

// Main execution
async function main() {
    try {
        const breaker = new UniversalCipherBreaker();
        await breaker.breakCipher(CIPHERTEXT);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();

export default UniversalCipherBreaker; 