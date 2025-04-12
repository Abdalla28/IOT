export const caesarCipher = (text, shift) => {
  if (!text) return "";

  return text
    .split("")
    .map((char) => {
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
    .join("")
    .replace(/\s/g, ""); // Remove all spaces
};

export const railFenceEncode = (text, key) => {
  if (!text) return "";
  let noSpaceText = text.split(" ").join("");

  if (key <= 1) return text;

  // Create the rail fence matrix
  const fence = Array(key)
    .fill()
    .map(() => Array(noSpaceText.length).fill(""));

  let rail = 0;
  let direction = 1; // 1 for moving down, -1 for moving up

  // Fill the fence pattern
  for (let i = 0; i < noSpaceText.length; i++) {
    fence[rail][i] = noSpaceText[i];

    rail += direction;

    // Change direction when we hit the top or bottom rail
    if (rail === key - 1) {
      direction = -1;
    } else if (rail === 0) {
      direction = 1;
    }
  }

  // Read off the encrypted text
  let result = "";
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < noSpaceText.length; j++) {
      if (fence[i][j] !== "") {
        result += fence[i][j];
      }
    }
  }

  return result;
};

export const railFenceDecode = (text, key) => {
  if (!text) return "";
  if (key <= 1) return text.replace(/\s/g, ""); // Remove spaces if key is 1

  const fence = Array(key)
    .fill()
    .map(() => Array(text.length).fill(""));

  // First, mark the positions where characters should be
  let rail = 0;
  let direction = 1;

  // Mark positions with '*'
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = "*";
    rail += direction;

    if (rail === key - 1) {
      direction = -1;
    } else if (rail === 0) {
      direction = 1;
    }
  }

  // Fill the fence with the encrypted text
  let index = 0;
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < text.length; j++) {
      if (fence[i][j] === "*" && index < text.length) {
        fence[i][j] = text[index++];
      }
    }
  }

  // Read off in zigzag pattern
  let result = "";
  rail = 0;
  direction = 1;

  for (let i = 0; i < text.length; i++) {
    result += fence[rail][i];
    rail += direction;

    if (rail === key - 1) {
      direction = -1;
    } else if (rail === 0) {
      direction = 1;
    }
  }

  return result.replace(/\s/g, ""); // Remove spaces from final output
};

// Create static Vigenère table
const VIGENERE_TABLE = [
  ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  ['B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A'],
  ['C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B'],
  ['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C'],
  ['E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D'],
  ['F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E'],
  ['G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F'],
  ['H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G'],
  ['I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H'],
  ['J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I'],
  ['K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J'],
  ['L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K'],
  ['M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L'],
  ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M'],
  ['O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
  ['P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
  ['Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],
  ['R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q'],
  ['S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R'],
  ['T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S'],
  ['U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'],
  ['V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'],
  ['W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V'],
  ['X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W'],
  ['Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'],
  ['Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y']
];

// Modified Vigenère encode function using the table
export const vigenereEncode = (text, key) => {
  if (!text || !key) return "";

  const textWithoutSpaces = text.replace(/\s/g, "");
  const upperKey = key.toUpperCase();
  const repeatedKey = Array(textWithoutSpaces.length)
    .fill(upperKey)
    .join("")
    .slice(0, textWithoutSpaces.length);

  return textWithoutSpaces
    .split("")
    .map((char, i) => {
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const plainChar = char.toUpperCase();
        const keyChar = repeatedKey[i];
        
        // Get row and column indices for table lookup
        const row = keyChar.charCodeAt(0) - 65;
        const col = plainChar.charCodeAt(0) - 65;
        
        // Look up the encoded character in the table
        const encodedChar = VIGENERE_TABLE[row][col];
        
        return isUpperCase ? encodedChar : encodedChar.toLowerCase();
      }
      return char;
    })
    .join("");
};

// Modified Vigenère decode function using the table
export const vigenereDecode = (text, key) => {
  if (!text || !key) return "";

  const textWithoutSpaces = text.replace(/\s/g, "");
  const upperKey = key.toUpperCase();
  const repeatedKey = Array(textWithoutSpaces.length)
    .fill(upperKey)
    .join("")
    .slice(0, textWithoutSpaces.length);

  return textWithoutSpaces
    .split("")
    .map((char, i) => {
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const cipherChar = char.toUpperCase();
        const keyChar = repeatedKey[i];
        
        // Get the row for the key character
        const row = keyChar.charCodeAt(0) - 65;
        
        // Find the column where cipherChar appears in this row
        const col = VIGENERE_TABLE[row].indexOf(cipherChar);
        
        // The original character is at index col in the first row
        const decodedChar = String.fromCharCode(col + 65);
        
        return isUpperCase ? decodedChar : decodedChar.toLowerCase();
      }
      return char;
    })
    .join("");
};