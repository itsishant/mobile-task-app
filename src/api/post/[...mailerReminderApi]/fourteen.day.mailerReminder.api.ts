import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.DEV_URL;
export const fourteenDayMailerReminderApi = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/post/fourteen-day-reminder/${data?._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(`Error in fourteenDayMailerReminderApi: ${error}`);
    return {
      success: false,
    };
  }
};
