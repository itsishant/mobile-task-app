import { SafeAreaView } from "react-native-safe-area-context"
import { Text } from "react-native"

export const HomeScreen = () => {
    return (
        <SafeAreaView className="bg-black flex-1 justify-center items-center">
            <Text className="text-neutral-200 font-bold text-5xl">Home Screen</Text>
        </SafeAreaView>
    )
}
