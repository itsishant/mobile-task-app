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
import { useState } from 'react';
import { LoginUser } from '../api/post/[...loginApi]/login.api';

export const LoginScreen = () => {
  const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await LoginUser(email, password);

      if (response?.success) {
        navigate.replace('MainTabs');
      } else {
        setErrorMessage(response?.message || 'Invalid email or password');
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center">
      <View className="flex-col justify-center items-center">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text
          style={{ fontFamily: 'Poppins-Bold', fontSize: 44 }}
          className="text-neutral-400"
        >
          Log in
        </Text>
      </View>
      <View className="flex-col justify-center items-center mt-2 space-y-4">
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor="#A3A3A3"
          placeholder="Email"
          className="bg-neutral-900 border placeholder-gray-500 border-gray-700 text-neutral-100 rounded-2xl mb-2 px-6 py-4 w-80 mt-4"
        />
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="#A3A3A3"
          secureTextEntry={true}
          className="bg-neutral-900 border placeholder-gray-500 border-gray-700 text-neutral-100 rounded-2xl mb-10 px-6 py-4 w-80 mt-4"
        />
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
          onPress={handleLogin}
          className="rounded-full bg-blue-700 tracking-wide px-32 mt-4 py-3 mb-4"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{ fontFamily: 'Poppins-Regular' }}
              className="text-xl text-neutral-200 font-medium"
            >
              Log in
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text
            style={{ fontFamily: 'Poppins-Regular' }}
            className="text-neutral-200 text-sm"
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigate.navigate('Signup')}>
            <Text
              style={{ fontFamily: 'Poppins-Regular' }}
              className="text-blue-400 text-sm ml-1"
            >   
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
