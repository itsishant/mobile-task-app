import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Simply Management</Text>
        <View>
          <TextInput style={styles.inputAccessoryView}></TextInput>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    width: 160,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputAccessoryView: {
    backgroundColor: 'transparent',
    padding: 10,
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    width: 350
  },
});
