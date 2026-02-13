import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.DEV_URL;
export const GetSubscription = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/subscription/get-subscription/${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data.subscription;
  } catch (error) {
    console.log(`Error while fetching subscriptions ${error}`);
  }
};
