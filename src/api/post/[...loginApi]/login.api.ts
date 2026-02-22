import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import appConfig from '../../../config/app.config';

const API_URL = appConfig.DEV_URL;

console.log("DEV_URL:", appConfig.DEV_URL);
console.log("Final API_URL:", API_URL);
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
