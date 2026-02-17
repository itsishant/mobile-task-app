import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/v1';
export const createSubscription = async (
  appName: string,
  category: string,
  planType: string,
  amount: string | number,
  currency: string,
  paymentMethod: string,
  autoRenew: boolean,
  startDate: string,
  nextBillingDate: string,
  reminderDaysBefore: number,
  status: string,
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('No token found in AsyncStorage');
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await axios.post(
      `${API_URL}/subscription/create-subscription`,
      {
        subscriptionDetails: {
          appName,
          category,
          planType,
        },
        billingDetails: {
          amount: typeof amount === 'string' ? parseFloat(amount) : amount,
          currency,
          paymentMethod,
          autoRenew,
        },
        datesDetails: {
          startDate,
          nextBillingDate,
        },
        reminderDaysBefore,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response;
  } catch (error) {
    console.log(`Error while creating subscription ${error}`);
    throw error;
  }
};
