import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyBottomTabBar from './MyBottomTabBar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppNavigation() {
  return (
    <NavigationContainer>
      {/* <SafeAreaProvider> */}
      <MyBottomTabBar />
      {/* </SafeAreaProvider> */}
    </NavigationContainer>
  );
}
