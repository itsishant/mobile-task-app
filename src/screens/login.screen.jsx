import { SafeAreaView } from "react-native-safe-area-context"
import { View } from "react-native"
import { Text } from "react-native"
import { Image } from "react-native"

export const LoginScreen = () => {
    return (
        <SafeAreaView className=" bg-black flex-1 justify-center items-center">
            <View>
               <Image
               source={require('../../public/logo.png')}
                        className="w-20 h-20"
                      />
            </View>
        </SafeAreaView>
    )
}
