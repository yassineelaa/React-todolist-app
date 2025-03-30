import React, { useContext, useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text, ImageBackground, Keyboard } from 'react-native';
import { TokenContext, UsernameContext } from '../Contexte/Context';
import { signUp } from '../api/api';

export default function SignUp({ navigation }) {
  const [, setToken] = useContext(TokenContext); 
  const [, setUsernameContext] = useContext(UsernameContext); 
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const functionSignUp = () => {
    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    signUp(usernameInput, passwordInput)
      .then((token) => {
        setLoading(false);
        setToken(token);
        setUsernameContext(usernameInput);
        navigation.navigate('Home'); 
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message); 
      });
  };

  return (
    <ImageBackground
      source={require('../assets/sign.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay} /> {/* Superposition semi-transparente */}
      <View style={styles.box}>
        <TextInput
          placeholder="Username"
          value={usernameInput}
          onChangeText={setUsernameInput}
          style={styles.input}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={passwordRef}
          placeholder="Password"
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={confirmPasswordRef}
          placeholder="Confirm Password"
          value={confirmPasswordInput}
          onChangeText={setConfirmPasswordInput}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="go"
          onSubmitEditing={functionSignUp}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Sign Up" onPress={functionSignUp} color="#A52A2A" />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Remplit tout l'écran
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Noir avec 50% de transparence
  },
  box: {
    width: '30%', 
    padding: 15,
    backgroundColor: '#F3E2CB',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3BEB0',
    marginBottom: 10,
    padding: 8,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#FDF5E6',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

