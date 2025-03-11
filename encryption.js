export const caesarCipher = (text, shift) => {
    if (!text) return "";
    
    return text
      .split("")
      .map(char => {
        if (char.match(/[a-z]/i)) { 
          const code = char.charCodeAt(0);
          const shiftAmount = shift % 26; // Ensure shift stays within 26 letters
          
          let newCode;
          if (code >= 65 && code <= 90) { 
            // Uppercase A-Z
            newCode = ((code - 65 + shiftAmount + 26) % 26) + 65;
          } else if (code >= 97 && code <= 122) { 
            // Lowercase a-z
            newCode = ((code - 97 + shiftAmount + 26) % 26) + 97;
          } else {
            return char; // Keep non-alphabetic characters unchanged
          }
  
          return String.fromCharCode(newCode);
        }
        return char;
      })
      .join("");
  };
  