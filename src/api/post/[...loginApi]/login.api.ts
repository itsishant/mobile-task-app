import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/v1';
export const LoginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/login-user`, {
      email: email,
      password: password,
    });

    await AsyncStorage.setItem('userId', response?.data?.userId);
    await AsyncStorage.setItem('token', response?.data?.token);
    await AsyncStorage.setItem('email', response?.data?.email);
    return response.data;
  } catch (error) {
    console.log('Error while logging in user api', error);
    return { success: false };
  }
};
