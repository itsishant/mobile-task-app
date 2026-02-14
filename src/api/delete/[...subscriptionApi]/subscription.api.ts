import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//

const API_URL = 'http://10.0.2.2:3000/api/v1';
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
