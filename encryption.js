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
    .join("")
    .replace(/\s/g, ""); // Remove spaces from final output
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
    .join("")
    .replace(/\s/g, ""); // Remove spaces from final output
};
