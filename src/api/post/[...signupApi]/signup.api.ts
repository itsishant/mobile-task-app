'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/v1';
export const createUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup/create-user`, {
      email: email,
      password: password,
    });

    if (response?.data?.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.data._id);
      await AsyncStorage.setItem('email', response.data.data.email);
    }

    return { success: true, ...response.data };
  } catch (error) {
    console.log('Error while creating user api', error);
    return { success: false, error: error };
  }
};
