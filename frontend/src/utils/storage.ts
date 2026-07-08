import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

const isWeb = Platform.OS === 'web';

const safeLocalStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return window.localStorage;
};

export const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    try {
      const storage = safeLocalStorage();
      return storage?.getItem(key) ?? null;
    } catch (error) {
      console.error('Unable to read from localStorage:', error);
      return null;
    }
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Unable to read from SecureStore:', error);
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    try {
      const storage = safeLocalStorage();
      storage?.setItem(key, value);
      return;
    } catch (error) {
      console.error('Unable to write to localStorage:', error);
      return;
    }
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Unable to write to SecureStore:', error);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  if (isWeb) {
    try {
      const storage = safeLocalStorage();
      storage?.removeItem(key);
      return;
    } catch (error) {
      console.error('Unable to remove from localStorage:', error);
      return;
    }
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Unable to delete from SecureStore:', error);
  }
};

export const STORAGE_KEYS = {
  token: TOKEN_KEY,
  user: USER_KEY,
};
