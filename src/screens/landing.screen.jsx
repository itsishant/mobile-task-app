import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export const LandingScreen = () => {
  const navigate = useNavigation();

  return (
    <SafeAreaView className="flex-1 min-h-screen justify-center items-center bg-black">
      <View className="justify-between items-center py-10">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text
          style={{ fontFamily: 'Poppins-Bold', fontSize: 24 }}
          className="text-5xl text-neutral-300 mt-6 text-center"
        >
          Loopify
        </Text>
      </View>
      <View className="flex flex-col col-1 justify-center items-center">
        <TouchableOpacity
          onPress={() => navigate.navigate('Signup')}
          className="rounded-3xl bg-blue-700 tracking-wide px-32 py-2 mb-4"
        >
          <Text
            className="text-lg text-neutral-100 font-medium"
            style={{ fontFamily: 'Poppins-Regular', fontSize: 20 }}
          >
            Sign up free
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate.navigate('Login')}>
          <Text
            className="text-xl text-neutral-200 font-medium"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
