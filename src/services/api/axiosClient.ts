import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, SECURE_STORE_TOKEN_KEY } from '@/constants/config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
