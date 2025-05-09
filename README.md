# CryptoCipher 🔐

CryptoCipher is a mobile application designed to help users understand and implement various encryption techniques. With support for multiple classical ciphers, users can encrypt and decrypt messages, see step-by-step explanations, and learn about cryptography concepts in an interactive way.

## Features 📱

- **Multiple Cipher Support**: Includes Caesar, Vigenère, and Rail Fence ciphers
- **Encryption & Decryption**: Easily convert between plaintext and ciphertext
- **Cipher Breaking**: Connect to the backend service to automatically break encrypted text
- **Input Validation**: Smart input handling that ensures correct key formats for each cipher
- **User-Friendly Interface**: Clean, intuitive design for seamless interaction

## Supported Ciphers 🔡

### Caesar Cipher
A substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet.

### Vigenère Cipher
A method of encrypting alphabetic text by using a simple form of polyalphabetic substitution, using a keyword to determine different shift values.

### Rail Fence Cipher
A transposition cipher that arranges the plaintext in a zigzag pattern across multiple "rails" and then reads off each rail to produce the ciphertext.

## Technology Stack 🛠️

### Mobile App (This Repository)
- **React Native**
- **JavaScript/ES6+**
- **Expo Platform**
- **Axios** for API communication

### Backend Services (Separate Repository)
The backend services for advanced features like cipher breaking are maintained in a separate repository:
- **Node.js/Express**
- **Natural Language Processing**
- **Cryptanalysis Algorithms**

[View Backend Repository](https://github.com/3bdalrahman/cipher_breaker_api)

## System Architecture

```text
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│  CryptoCipher App   │◄────►│  CryptoCipher API   │
│  (This Repository)  │      │  (Backend Repo)     │
│                     │      │                     │
└─────────────────────┘      └─────────────────────┘
```

## Getting Started 🚀

### Prerequisites
- Node.js 14.0 or later
- npm or Yarn
- Expo CLI
- Access to the CryptoCipher backend (for cipher breaking functionality)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Abdalla28/IOT.git
   ```

2. Install dependencies
   ```bash
   cd cryptocipher
   npm install
   # or
   yarn install
   ```

3. Configure the backend connection
   - Open `App.js`
   - Update the `API_BASE_URL` constant with your backend server address

4. Start the development server
   ```bash
   expo start
   ```

5. Launch on your preferred device or emulator

## Backend Setup

To use advanced features like cipher breaking, you'll need to set up the backend:

1. Clone the backend repository
   ```bash
   git clone https://github.com/3bdalrahman/cipher_breaker_api
   ```

2. Follow the installation instructions in the backend repository's README.md

## How to Use 💡

### Normal Mode
1. Select your desired encryption algorithm (Caesar, Vigenère, or Rail Fence)
2. Enter your text (alphabetic characters only)
3. Provide the appropriate key:
   - Caesar: Numeric shift value
   - Vigenère: Alphabetic keyword
   - Rail Fence: Numeric number of rails
4. Choose to Encrypt or Decrypt
5. View your results instantly

### Break Mode
1. Switch to "Break" mode
2. Enter the encrypted text you want to decrypt
3. Press "Break Cipher"
4. The app will connect to the backend service to analyze and attempt to break the cipher
5. View potential decryptions sorted by likelihood

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements 🔮

- [ ] Add more cipher algorithms (Playfair, Substitution, etc.)
- [ ] Enhance the cipher breaking capabilities
- [ ] Create a cryptography learning module with tutorials
- [ ] Add historical context for each cipher
- [ ] Support for non-alphabetic characters
- [ ] Offline mode for cipher breaking

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 📧

Project Link: [https://github.com/Abdalla28/IOT](https://github.com/Abdalla28/IOT)

Backend Repository: [https://github.com/3bdalrahman/cipher_breaker_api](https://github.com/3bdalrahman/cipher_breaker_api)

## Team 👥

Meet the talented developers behind CryptoCipher:

### Abdulrhman Ahmed
- GitHub: [Abdulrhman Ahmed](https://github.com/3bdalrahman)
- LinkedIn: [Abdulrhman Ahmed](https://www.linkedin.com/in/abdulrhman-ahmed03/)

## Acknowledgments 🙏

- Classical cryptography resources and references
- React Native community
- Natural language processing libraries used in the backend
- All beta testers and early adopters

---

Made with ❤️ by the CryptoCipher Team
