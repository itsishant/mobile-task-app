import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '../api/post/[...signupApi]/signup.api';
import { useState } from 'react';

export const SignupScreen = () => {
  const navigate = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await createUser(email, password);

      if (response?.success) {
        console.log(response);
        navigate.navigate('MainTabs');
      } else {
        setErrorMessage(response?.message || 'Signup failed. Please try again');
      }
    } catch (error) {
      console.log(`SIGNUP ERROR: ${error}`);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className=" bg-black flex-1 justify-center items-center">
      <View className="flex-col justify-center items-center">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text
          style={{ fontFamily: 'Poppins-Bold', fontSize: 44 }}
          className="text-neutral-400 "
        >
          Sign up
        </Text>{' '}
      </View>
      <View className="flex-col justify-center items-center mt-2 space-y-4">
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
        {errorMessage ? (
          <Text
            style={{
              color: '#FF3333',
              fontFamily: 'Poppins-Regular',
              marginBottom: 8,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={handleSignup}
          className="rounded-full bg-blue-700 tracking-wide mt-10 px-32 py-3 mb-4"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{ fontFamily: 'Poppins-Regular' }}
              className="text-xl text-neutral-200 font-medium"
            >
              Sign up
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text
            style={{ fontFamily: 'Poppins-Regular' }}
            className="text-neutral-200  text-sm"
          >
            Already have an account?
          </Text>

          <TouchableOpacity onPress={() => navigate.navigate('Login')}>
            <Text
              style={{ fontFamily: 'Poppins-Regular' }}
              className="text-blue-400  text-sm ml-1"
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
