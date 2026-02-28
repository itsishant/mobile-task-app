import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../screens/landing.screen.jsx';
import { SignupScreen } from '../screens/signup.screen.jsx';
import { LoginScreen } from '../screens/login.screen.jsx';
import { OtpScreen } from '../screens/otp.screen.jsx';
import { HomeScreen } from '../screens/home.screen.jsx';
import { ProfileScreen } from '../screens/profile.screen.jsx';
import { SearchScreen } from '../screens/search.screen.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#3CB371',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen 
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        )
      }}
      />

    </Tab.Navigator>
  );
};

export const AppNavigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      setInitialRoute(token ? 'MainTabs' : 'Landing');
    });
  }, []);

  if (!initialRoute) {
    return <View style={{ flex: 1, backgroundColor: '#09090b' }} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};
