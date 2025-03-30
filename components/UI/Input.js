import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function Input({ placeholder, onSubmit }) {
  const [value, setValue] = useState('');

  const functionSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue(''); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={styles.input}
        onSubmitEditing={functionSubmit}  
        returnKeyType="done"  
      />
      <Button title="Soumettre" onPress={functionSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
  },
});

