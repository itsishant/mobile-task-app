import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LandingScreen = () => {
  const navigate = useNavigation();

  const token = AsyncStorage.getItem("token");
  if (token) {
    navigate.replace("MainTabs")
  }

  return (
    <SafeAreaView className="flex-1 min-h-screen justify-center items-center bg-black">
      <View className="justify-between items-center py-10">
        <Image
          source={require('../../public/logo.png')}
          className="w-20 h-20"
        />
        <Text className="text-5xl text-neutral-200 mt-6 font-bold text-center">
          Loopify
        </Text>
      </View>
      <View className="flex flex-col col-1 justify-center items-center">
        <TouchableOpacity
          onPress={() => navigate.navigate('Signup')}
          className="rounded-3xl bg-blue-700 tracking-wide px-32 py-2 mb-4"
        >
          <Text className="text-xl text-neutral-100 font-medium">
            Sign up free
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate.navigate('Login')}>
          <Text className="text-xl text-neutral-200 font-medium">log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
