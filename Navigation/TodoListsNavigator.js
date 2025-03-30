import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoListScreen from '../Screen/TodoListScreen';  
import TodoItem from '../components/TodoItem';  

const Stack = createNativeStackNavigator();

export default function TodoListsNavigator() {
  return (
    <Stack.Navigator>
      {/* un écran pour afficher la liste des TodoLists */}
      <Stack.Screen name="TodoLists" component={TodoListScreen} />
      
      {/* L'écran pour afficher les items d'une TodoList */}
      <Stack.Screen name="TodoItems" component={TodoItem} />
    </Stack.Navigator>
  );
}

