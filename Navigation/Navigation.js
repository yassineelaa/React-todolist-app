import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen';
import TodoListsNavigator from './TodoListsNavigator'; 
import SignInScreen from '../Screen/SignInScreen';
import SignOutScreen from '../Screen/SignOutScreen';
import { TokenContext } from '../Contexte/Context';
import SignUp from '../Screen/SignUp';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [token] = useContext(TokenContext);

  return (
    <NavigationContainer>
      {token == null ? (
        <Tab.Navigator>
          <Tab.Screen name='SignIn' component={SignInScreen} />
          <Tab.Screen name='SignUp' component={SignUp} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name='Home' component={HomeScreen} />
          
          <Tab.Screen name='TodoLists' component={TodoListsNavigator} />
          
          <Tab.Screen name='SignOut' component={SignOutScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

