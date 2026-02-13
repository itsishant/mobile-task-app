import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.DEV_URL;
export const EditSubscription = async (id: string, data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/subscription/update-subscription/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(`Error while editing subscription ${error}`);
  }
};
