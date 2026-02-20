import { Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const SearchScreen = () => {
    return(
        <SafeAreaView className="bg-black flex-1 justify-center">
            <View className="px-4 py-2.5">
                <TextInput 
                className="bg-black-800 border border-neutral-200
                 text-white p-4 rounded-xl"
                 placeholder="Search subscriptions..."
                 
              placeholderTextColor="#a3a3a3"/>
            </View>
        </SafeAreaView>
        
    )
}
