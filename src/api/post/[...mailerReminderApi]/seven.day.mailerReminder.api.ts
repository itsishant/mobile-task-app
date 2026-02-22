import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//

import appConfig from '../../../config/app.config';

const API_URL = appConfig.DEV_URL;
export const sevenDayMailerReminderApi = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/post/seven-day-reminder/${data?._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(`Error in sevenDayMailerReminderApi: ${error}`);
    return {
      success: false,
    };
  }
};
