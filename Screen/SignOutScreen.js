import React, { useContext } from 'react';
import { View, Button, Text, StyleSheet, ImageBackground } from 'react-native';
import { TokenContext, UsernameContext } from '../Contexte/Context';

export default function SignOutScreen() {
  const [, setToken] = useContext(TokenContext);
  const [username] = useContext(UsernameContext); 
  const [, setUsername] = useContext(UsernameContext);

  const functionSignOut = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <ImageBackground
      source={require('../assets/backg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.messageText}>You Can Do It ! {username || 'Guest'}.</Text>

        <Button title="Sign Out" onPress={functionSignOut} color="#A52A2A"/>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', 
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D3CA',
    padding: 60,
    borderRadius: 10,
    opacity: 0.9
  },
  messageText: {
    fontSize: 50, 
    fontWeight: 'bold', 
    color: 'black', 
    marginBottom: 20, 
  },
});

