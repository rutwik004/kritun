import React from 'react';
import { NavigationContainer, DefaultTheme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Merge dark themes for both navigation and paper
const CombinedTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00FFD1',      // neon cyan
    secondary: '#8e24aa',    // purple
    background: '#121212',   // dark background
    surface: '#1f1f1f',      // cards
    text: '#ffffff',
  },
};

export default function App() {
  return (
    <PaperProvider theme={CombinedTheme}>
      <NavigationContainer theme={NavTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
