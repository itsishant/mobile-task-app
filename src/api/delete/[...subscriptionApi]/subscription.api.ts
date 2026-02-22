import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//

import appConfig from '../../../config/app.config';

const API_URL = appConfig.DEV_URL;
export const DeleteSubscription = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/subscription/delete-subscription/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(`Error while deleting subscription ${error}`);
  }
};
