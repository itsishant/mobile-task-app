import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import appConfig from '../../../config/app.config';

const API_URL = appConfig.DEV_URL;
export const EditSubscription = async (id: string, data: any) => {
  try {
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error(`Invalid subscription ID format: ${id}`);
    }

    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

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
