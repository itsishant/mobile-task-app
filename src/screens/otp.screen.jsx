import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { verifyOTP } from '../api/post/[...otpApi]/opt.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const OtpScreen = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await verifyOTP(userId, otp);

      if (response?.success) {
        console.log('OTP verified successfully');
        navigate.navigate('Home');
      } else {
        setErrorMessage(response?.message || 'Invalid OTP. Please try again');
      }
    } catch (error) {
      console.log(`Error while verifying OTP: ${error}`);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center">
      <View className="flex justify-center items-center gap-4">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <TextInput
          value={otp}
          onChangeText={text => setOtp(text)}
          placeholderTextColor="#A3A3A3"
          placeholder="Enter your OTP"
          className="bg-neutral-900 border border-gray-700 text-neutral-100 rounded-2xl mb-2 px-6 py-4 w-80 mt-4"
        ></TextInput>
        {errorMessage ? (
          <Text
            style={{ color: '#FF3333', fontFamily: 'Poppins-Regular' }}
            className="text-sm"
          >
            {errorMessage}
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={handleVerification}
          className="rounded-full bg-blue-700 tracking-wide px-32 py-3 mb-4"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{ fontFamily: 'Poppins-Regular' }}
              className="text-xl text-neutral-200 font-medium"
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
