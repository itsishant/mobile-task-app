'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//

const API_URL = 'http://10.0.2.2:3000/api/v1';
export const createSubscription = async (
  appName: string,
  category: string,
  planType: string,
  amount: string,
  currency: string,
  paymentMethod: string,
  autoRenew: boolean,
  startDate: string,
  nextBillingDate: string,
  remindaerDaysBefore: string,
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('No token found in AsyncStorage');
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = axios.post(
      `${API_URL}/subscription/create-subscription`,
      {
        appName: appName,
        category: category,
        planType: planType,
        amount: amount,
        currency: currency,
        paymentMethod: paymentMethod,
        autoRenew: autoRenew,
        startDate: startDate,
        nextBillingDate: nextBillingDate,
        remindaerDaysBefore: remindaerDaysBefore,
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
