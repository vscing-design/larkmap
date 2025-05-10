import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
// import { combine } from 'zustand/middleware';
import persistStorage from './persistStorage';
import { isDevMode } from '@/utils/env';

export const setupStore = <T>(store: any, persistStorageKey: string) => {
  if(!persistStorageKey) {
    throw new Error('persistStorageKey 必须提供');
  }
  // devtools
  if (isDevMode()) {
    store = devtools<T>(store);
  }
  // subscribeWithSelector
  store = subscribeWithSelector<T>(store);
  // persist
  store = persist<T>(store, {
    name: persistStorageKey,
    storage: createJSONStorage(() => persistStorage),
  });
  // create the store
  return create<T>()(store)!;
}