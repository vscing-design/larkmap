import type { StateStorage } from 'zustand/middleware';
import cacheStorage from '@/utils/cache';

const persistStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, 'has been retrieved');
    return (await cacheStorage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, 'with value', value, 'has been saved');
    await cacheStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    // console.log(name, 'has been deleted');
    await cacheStorage.removeItem(name);
  },
};

export default persistStorage;