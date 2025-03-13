import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import styles from './styles';
import { caesarCipher, vigenereEncode, vigenereDecode, railFenceEncode, railFenceDecode } from './encryption';

export default function App() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [selectedType, setSelectedType] = useState(0);
  const [isEncoding, setIsEncoding] = useState(true);
  const [result, setResult] = useState('');

  const isAlphabetic = (str) => /^[A-Za-z]*$/.test(str);
  const isNumeric = (str) => /^[0-9]*$/.test(str);

  const handleKeyChange = (value) => {
    // Validate input based on selected cipher type
    if (selectedType === 1) { // Vigenere
      if (isAlphabetic(value)) {
        setKey(value);
      }
    } else { // Caesar or Rail Fence
      if (isNumeric(value)) {
        setKey(value);
      }
    }
  };

  const processText = () => {
    let processedText = "This algorithm is not implemented yet.";

    if (selectedType === 0) { // Caesar Cipher
      if (!isNumeric(key)) {
        setResult("Error: Key must be numeric for Caesar Cipher.");
        return;
      }
      const shift = parseInt(key, 10) || 0;
      processedText = caesarCipher(text, isEncoding ? shift : -shift);
    } 
    else if (selectedType === 1) { // Vigenere Cipher
      if (!isAlphabetic(key)) {
        setResult("Error: Key must be alphabetic for Vigenere Cipher.");
        return;
      }
      processedText = isEncoding 
        ? vigenereEncode(text, key)
        : vigenereDecode(text, key);
    }
    else if (selectedType === 2) { // Rail Fence
      if (!isNumeric(key)) {
        setResult("Error: Key must be numeric for Rail Fence Cipher.");
        return;
      }
      processedText = isEncoding 
        ? railFenceEncode(text, parseInt(key, 10)) 
        : railFenceDecode(text, parseInt(key, 10));
    }

    setResult(`Original: ${text}\n${isEncoding ? 'Encrypted' : 'Decrypted'}: ${processedText}\nKey: ${key}\nAlgorithm: ${selectedType === 0 ? 'Caesar' : selectedType === 1 ? 'Vigenere' : 'Rail Fence'}`);
  };

  // When cipher type changes, clear the key
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setKey(''); // Clear key when changing cipher type
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter The Text</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: hello world"
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>Enter The Key</Text>
      <TextInput
        style={styles.input}
        placeholder={selectedType === 1 ? "Key (letters only)" : "Key (numbers only)"}
        placeholderTextColor="#888"
        value={key}
        onChangeText={handleKeyChange}
        keyboardType={selectedType === 1 ? "default" : "numeric"}
      />

      <Text style={styles.label}>Choose The Algorithm</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 0 && styles.activeTab]} 
          onPress={() => handleTypeChange(0)}
        >
          <Text style={styles.tabText}>Caesar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 1 && styles.activeTab]} 
          onPress={() => handleTypeChange(1)}
        >
          <Text style={styles.tabText}>Vigenere</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 2 && styles.activeTab]} 
          onPress={() => handleTypeChange(2)}
        >
          <Text style={styles.tabText}>Rail Fence</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, isEncoding && styles.activeTab]} 
          onPress={() => setIsEncoding(true)}
        >
          <Text style={styles.tabText}>Encode</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, !isEncoding && styles.activeTab]} 
          onPress={() => setIsEncoding(false)}
        >
          <Text style={styles.tabText}>Decode</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={processText}>
        <Text style={styles.buttonText}>{isEncoding ? 'Encrypt' : 'Decrypt'}</Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          {result.split('\n').map((line, index) => (
            <Text key={index} style={styles.resultText}>{line}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
