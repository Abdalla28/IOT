import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import styles from './styles';
import { caesarCipher } from './encryption';

export default function App() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [selectedType, setSelectedType] = useState(0);
  const [result, setResult] = useState('');

  const isAlphabetic = (str) => /^[A-Za-z]+$/.test(str);

  const encrypt = () => {
    let encryptedText = "This algorithm is not implemented yet.";

    if (selectedType === 0) { 
      // Caesar Cipher
      const shift = parseInt(key, 10) || 0; // Convert key to number, default to 0 if invalid
      encryptedText = caesarCipher(text, shift);
    } 
    else if (selectedType === 1) { 
      // Vigenere Cipher (Only alphabetic keys allowed)
      if (!isAlphabetic(key)) {
        setResult("Error: Key must be alphabetic for Vigenere Cipher.");
        return;
      }
      encryptedText = "Vigenere encryption will be here"; // Placeholder for actual function
    }

    setResult(`Original: ${text}\nEncrypted: ${encryptedText}\nKey: ${key}\nAlgorithm: ${selectedType === 0 ? 'Caesar' : selectedType === 1 ? 'Vigenere' : 'Rail Fence'}`);
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
        placeholder="Key"
        placeholderTextColor="#888"
        value={key}
        onChangeText={setKey}
      />

      <Text style={styles.label}>Choose The Algorithm</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 0 && styles.activeTab]} 
          onPress={() => setSelectedType(0)}
        >
          <Text style={styles.tabText}>Caesar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 1 && styles.activeTab]} 
          onPress={() => setSelectedType(1)}
        >
          <Text style={styles.tabText}>Vigenere</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedType === 2 && styles.activeTab]} 
          onPress={() => setSelectedType(2)}
        >
          <Text style={styles.tabText}>Rail Fence</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={encrypt}>
        <Text style={styles.buttonText}>Encrypt</Text>
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
