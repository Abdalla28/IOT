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
  
// Vigenère cipher encoding function
export const vigenereEncode = (text, key) => {
  if (!text || !key) return "";
  
  // Convert key to uppercase and repeat it to match text length
  const upperKey = key.toUpperCase();
  const repeatedKey = Array(text.length)
    .fill(upperKey)
    .join("")
    .slice(0, text.length);

  return text
    .split("")
    .map((char, i) => {
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0);
        const keyCode = repeatedKey[i].charCodeAt(0);
        
        // Calculate shift and apply encoding
        const shift = keyCode - 65; // A = 0, B = 1, etc.
        let encodedCode = ((charCode - 65 + shift) % 26) + 65;
        
        // Preserve original case
        return isUpperCase
          ? String.fromCharCode(encodedCode)
          : String.fromCharCode(encodedCode).toLowerCase();
      }
      return char; // Keep non-alphabetic characters unchanged
    })
    .join("");
};

// Vigenère cipher decoding function
export const vigenereDecode = (text, key) => {
  if (!text || !key) return "";
  
  // Convert key to uppercase and repeat it to match text length
  const upperKey = key.toUpperCase();
  const repeatedKey = Array(text.length)
    .fill(upperKey)
    .join("")
    .slice(0, text.length);

  return text
    .split("")
    .map((char, i) => {
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0);
        const keyCode = repeatedKey[i].charCodeAt(0);
        
        // Calculate shift and apply decoding
        const shift = keyCode - 65; // A = 0, B = 1, etc.
        let decodedCode = ((charCode - 65 - shift + 26) % 26) + 65;
        
        // Preserve original case
        return isUpperCase
          ? String.fromCharCode(decodedCode)
          : String.fromCharCode(decodedCode).toLowerCase();
      }
      return char; // Keep non-alphabetic characters unchanged
    })
    .join("");
};
  