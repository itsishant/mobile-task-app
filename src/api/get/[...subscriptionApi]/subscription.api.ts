import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const API_URL = 'http://10.0.2.2:3000/api/v1';
export const GetSubscription = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem("userId");
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
