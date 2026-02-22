import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import appConfig from '../../../config/app.config';

const API_URL = appConfig.DEV_URL;
export const GetSubscription = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const response = await axios.get(
      `${API_URL}/subscription/get-subscription/${userId}`,
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
