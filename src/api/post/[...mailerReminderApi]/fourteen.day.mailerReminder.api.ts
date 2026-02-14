import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//

const API_URL = 'http://10.0.2.2:3000/api/v1';
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
