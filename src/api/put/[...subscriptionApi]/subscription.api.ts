import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/v1';
export const EditSubscription = async (id: string, data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    // Ensure amount is a number
    const formattedData = {
      subscriptionDetails: data.subscriptionDetails || {},
      billingDetails: {
        ...data.billingDetails,
        amount:
          typeof data.billingDetails?.amount === 'string'
            ? parseFloat(data.billingDetails.amount)
            : data.billingDetails?.amount,
      },
      datesDetails: data.datesDetails || {},
      reminderDaysBefore: data.reminderDaysBefore,
      status: data.status,
    };

    const response = await axios.put(
      `${API_URL}/subscription/update-subscription/${id}`,
      formattedData,
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
    throw error;
  }
};
