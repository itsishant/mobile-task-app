import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../screens/landing.screen.jsx';
import { SignupScreen } from '../screens/signup.screen.jsx';
import { LoginScreen } from '../screens/login.screen.jsx';
import { HomeScreen } from '../screens/home.screen.jsx';
import { OtpScreen } from '../screens/otp.screen.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
export const MainTabs = () => {
  return (
     <Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarStyle: { backgroundColor: "#000" },
    tabBarActiveTintColor: "#3CB371",
    tabBarInactiveTintColor: "#888",
  }}
    >
      <Tab.Screen
      options={{
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home" size={size} color={color} />
        )
      }}
      name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export const AppNaviagtion = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};
