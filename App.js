import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import styles from "./styles";
import {
  caesarCipher,
  vigenereEncode,
  vigenereDecode,
  railFenceEncode,
  railFenceDecode,
} from "./encryption";
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://192.168.100.4:3000/api';
const BREAK_ENDPOINT = '/break-cipher';

export default function App() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [selectedType, setSelectedType] = useState(0);
  const [isEncoding, setIsEncoding] = useState(true);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("normal");
  const [breakType, setBreakType] = useState("caesar");
  const [isLoading, setIsLoading] = useState(false);

  const isAlphabetic = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumeric = (str) => /^[0-9]*$/.test(str);

  const handleKeyChange = (value) => {
    // Validate input based on selected cipher type
    if (selectedType === 1) {
      // Vigenere
      if (isAlphabetic(value)) {
        setKey(value);
      }
    } else {
      // Caesar or Rail Fence
      if (isNumeric(value)) {
        setKey(value);
      }
    }
  };

  const handleTextChange = (value) => {
    if (mode === "break") {
      // Accept all characters in break mode
      setText(value);
    } else {
      // Only allow alphabetic characters and spaces in normal mode
      if (isAlphabetic(value)) {
        setText(value);
      }
    }
  };

  const processText = () => {
    let processedText = "This algorithm is not implemented yet.";

    if (selectedType === 0) {
      // Caesar Cipher
      if (!isNumeric(key)) {
        setResult("Error: Key must be numeric for Caesar Cipher.");
        return;
      }
      const shift = parseInt(key, 10) || 0;
      processedText = caesarCipher(text, isEncoding ? shift : -shift);
    } else if (selectedType === 1) {
      // Vigenere Cipher
      if (!isAlphabetic(key)) {
        setResult("Error: Key must be alphabetic for Vigenere Cipher.");
        return;
      }
      processedText = isEncoding
        ? vigenereEncode(text, key)
        : vigenereDecode(text, key);
    } else if (selectedType === 2) {
      // Rail Fence
      if (!isNumeric(key)) {
        setResult("Error: Key must be numeric for Rail Fence Cipher.");
        return;
      }
      processedText = isEncoding
        ? railFenceEncode(text, parseInt(key, 10))
        : railFenceDecode(text, parseInt(key, 10));
    }

    setResult(
      `Original: ${text}\n${
        isEncoding ? "Encrypted" : "Decrypted"
      }: ${processedText}\nKey: ${key}\nAlgorithm: ${
        selectedType === 0
          ? "Caesar"
          : selectedType === 1
          ? "Vigenere"
          : "Rail Fence"
      }`
    );
  };

  // When cipher type changes, clear the key
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setKey(""); // Clear key when changing cipher type
  };

  const handleBreak = async () => {
    if (!text) {
      setResult("Please enter text to break");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        ciphertext: text.toUpperCase()
      };
      console.log('Sending request:', requestData);

      const response = await axios.post(`${API_BASE_URL}${BREAK_ENDPOINT}`, requestData);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const data = response.data;
      console.log('Received response:', data);
      
      // Format the results to show only rank, method, key, and decrypted text
      if (data.finalAnalysis && data.finalAnalysis.candidates) {
        const formattedResults = data.finalAnalysis.candidates.map(candidate => {
          return `Rank ${candidate.rank}:\n` +
                 `Method: ${candidate.method}\n` +
                 `Key: ${candidate.key}\n` +
                 `Decrypted Text: ${candidate.decryptedText}\n`;
        }).join('\n');
        
        setResult(formattedResults);

      } else {
        setResult('No valid results found in the response');
      }
    } catch (error) {
      console.error('Break error:', error);
      let errorMessage = 'Error breaking cipher: ';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage += error.response.data?.message || error.response.statusText || 'Server error';
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += error.message;
      }
      
      setResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, mode === "normal" && styles.activeTab]}
            onPress={() => setMode("normal")}
          >
            <Text style={styles.tabText}>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === "break" && styles.activeTab]}
            onPress={() => setMode("break")}
          >
            <Text style={styles.tabText}>Break</Text>
          </TouchableOpacity>
        </View>

        {mode === "normal" ? (
          <>
            <Text style={styles.label}>Enter The Text (letters only)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: hello world"
              placeholderTextColor="#888"
              value={text}
              onChangeText={handleTextChange}
            />

            <Text style={styles.label}>Enter The Key</Text>
            <TextInput
              style={styles.input}
              placeholder={
                selectedType === 1 ? "Key (letters only)" : "Key (numbers only)"
              }
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
              <Text style={styles.buttonText}>
                {isEncoding ? "Encrypt" : "Decrypt"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter The Text to Break</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter encrypted text"
              placeholderTextColor="#888"
              value={text}
              onChangeText={handleTextChange}
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleBreak}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Break Cipher</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {result ? (
          <ScrollView style={[styles.resultContainer, { maxHeight: 200 }]}>
            {result.split("\n").map((line, index) => (
              <Text key={index} style={styles.resultText}>
                {line}
              </Text>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </ScrollView>
  );
}
