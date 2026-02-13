'use client';

import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.DEV_URL;
export const createUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup/create-user`, {
      email: email,
      password: password,
    });

    localStorage.setItem('userId', response?.data?.data?._id);
    localStorage.setItem('token', response?.data?.data?.token);
    localStorage.setItem('email', response?.data?.data?.email);

    return response.data;
  } catch (error) {
    console.log('Error while creating user api');
  }
};
