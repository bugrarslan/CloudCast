import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen'
import OnboardScreen from './src/screens/OnboardScreen'
import WebScreen from "./src/screens/WebScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Onboard" component={OnboardScreen} />
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Web" component={WebScreen}/>
      </Stack.Navigator> 
    </NavigationContainer>
  )
}

export default App
