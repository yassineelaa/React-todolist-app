import React, { useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { UsernameContext } from '../Contexte/Context';

export default function HomeScreen() {
  const [username] = useContext(UsernameContext);

  return (
    <ImageBackground
      source={require('../assets/backg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textBackground}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.usernameText}>You are logged as {username || 'Guest'}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBackground: {
    backgroundColor: '#D9D3CA',
    padding: 60, 
    borderRadius: 10, 
    alignItems: 'center',
    opacity: 0.9
  },
  welcomeText: {
    fontSize: 50, 
    fontWeight: 'bold', 
    color: 'black',
    marginBottom: 10, 
  },
  usernameText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'black', 
  },
});

