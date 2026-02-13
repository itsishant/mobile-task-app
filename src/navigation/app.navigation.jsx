import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../screens/landing.screen.jsx';
import { SignupScreen } from '../screens/signup.screen.jsx';
import { LoginScreen } from '../screens/login.screen.jsx';
import { HomeScreen } from '../screens/home.screen.jsx';

export const AppNaviagtion = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
