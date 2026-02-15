import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { Logout } from "lucide-react-native";
import { Image } from 'react-native';

export const HomeScreen = () => {
  return (
    <View className="flex-1 bg-neutral-900">
      <SafeAreaView edges={['top']} className="bg-black">
        <View className="py-6 flex justify-between items-center bg-black">
          
          <View className='flex-row gap-2 justify-center items-center'>
          <Image 
          source={require('../../public/logo.png')}
          className="w-10 h-10"
          /><Text style={{ fontFamily: 'Poppins-Regular', fontSize: 24 }} className='text-neutral-200 '>
            Loopify
          </Text>
          </View>
          <Logout color="#A3A3A3" size={24} />
        </View>
      </SafeAreaView>
    </View>
  );
};
