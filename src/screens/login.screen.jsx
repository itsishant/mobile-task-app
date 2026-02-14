import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { LoginUser } from '../api/post/[...loginApi]/login.api';

export const LoginScreen = () => {
  const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await LoginUser(email, password);

      if (response?.success) {
        navigate.replace("MainTabs");
      } else {
        Alert.alert('Error', response?.message || 'Login failed');
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView className=" bg-black flex-1 justify-center items-center">
      <View className="flex-col justify-center items-center gap-6">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text className="text-neutral-300 font-bold text-5xl">Log in</Text>
      </View>
      <View className="flex-col justify-center items-center mt-10 space-y-4">
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor="#A3A3A3"
          placeholder="Email"
          className="bg-neutral-900 border placeholder-gray-500 border-gray-700 text-neutral-100 rounded-2xl mb-2 px-6 py-4 w-80 mt-4"
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="#A3A3A3"
          secureTextEntry={true}
          className="bg-neutral-900 border placeholder-gray-500 border-gray-700 text-neutral-100 rounded-2xl mb-10 px-6 py-4 w-80 mt-4"
        ></TextInput>
        <TouchableOpacity
          onPress={handleLogin}
          className="rounded-full bg-blue-700 tracking-wide px-32 mt-4 py-3 mb-4"
        >
          <Text className="text-xl text-neutral-200 font-medium">Log in</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text className="text-neutral-200 font-medium text-md">
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={() => navigate.navigate('Signup')}>
            <Text className="text-blue-400 font-medium text-md ml-1">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
