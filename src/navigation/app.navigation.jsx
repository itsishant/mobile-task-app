import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LandingScreen } from "../screens/landing.screen.jsx";
import { LoginScreen } from "../screens/login.screen.jsx";

export const AppNaviagtion = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Landing"  screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen}/>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}
