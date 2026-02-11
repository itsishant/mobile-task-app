import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import './global.css';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView className="flex min-h-screen justify-center items-center bg-black">
      <View className="flex-1 justify-between items-center py-10">
        <Text className="text-5xl text-green-200  mt-6 font-bold text-center">
          Silly
          <Text className="text-5xl text-blue-600 font-bold text-center">
            {' '}
            Manage
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
