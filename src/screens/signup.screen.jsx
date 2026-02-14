import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '../api/post/[...signupApi]/signup.api';
import { useState } from 'react';

export const SignupScreen = () => {
  const navigate = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await createUser(email, password);

      if (response?.success) {
        console.log(response);
        navigate.navigate('Otp');
      }
    } catch (error) {
      console.log(`SIGNUP ERROR: ${error}`);
    }
  };

  return (
    <SafeAreaView className=" bg-black flex-1 justify-center items-center">
      <View className="flex-col justify-center items-center gap-6">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text className="text-neutral-300 font-bold text-5xl">Sign up</Text>
      </View>
      <View className="flex-col justify-center items-center mt-10 space-y-4">
        <Text>Email</Text>
        <TextInput
          value={email}
          placeholderTextColor="#A3A3A3"
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          className="bg-neutral-900 border  border-gray-700 text-neutral-100 rounded-2xl mb-2 px-6 py-4 w-80 mt-4"
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="#A3A3A3"
          secureTextEntry={true}
          className="bg-neutral-900 border  border-gray-700 text-neutral-100 rounded-2xl mb-2 px-6 py-4 w-80 mt-4"
        ></TextInput>
        <TouchableOpacity
          onPress={handleSignup}
          className="rounded-full bg-blue-700 tracking-wide mt-10 px-32 py-3 mb-4"
        >
          <Text className="text-xl text-neutral-200 font-medium">Sign up</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text className="text-neutral-200 font-medium text-md">
            Already have an account?
          </Text>

          <TouchableOpacity onPress={() => navigate.navigate('Login')}>
            <Text className="text-blue-400 font-medium text-md ml-1">
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
