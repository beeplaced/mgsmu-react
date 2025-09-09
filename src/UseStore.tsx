import { useEffect, useState } from 'react';

// Global state
let state: Record<string, any> = {};

// Listeners
const listeners = new Set<() => void>();

// Get current state
export const getState = () => state;

// Set a specific key in state with timestamp
export const setStateStore = (entry: any, key: string = "data") => {
  state = {
    ...state,
    [key]: {
      ...entry,
      updatedAt: Date.now(),
    }
  };
  listeners.forEach((listener) => listener());
};

// Create a new state without the specified keys
export const removeStateStore = (...keys: string[]) => {
  const newState = { ...state };
  keys.forEach((key) => {
    delete newState[key]; // remove the key
  });

  state = {
    ...newState,
    updatedAt: Date.now(), // global timestamp after removal
  };
  listeners.forEach((listener) => listener());
};

export const subscribeKey = (key: string, listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useStateStore = (key: string) => {
  const [value, setValue] = useState(state[key]);

  useEffect(() => {
    const update = () => setValue(state[key]);
    return subscribeKey(key, update);
  }, [key]);

  return [value, (v: any) => setStateStore(v, key), removeStateStore] as const;
};
