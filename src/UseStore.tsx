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
    [key]: entry,            // update the key
    updatedAt: Date.now(),   // global timestamp
  };
  listeners.forEach((listener) => listener());
};

// Create a new state without the specified keys
export const removeStateStore = (...keys: string[]) => { 
  const newState = { ...state };
  keys.forEach((key) => {
    delete newState[key];
  });

  state = { ...newState, updatedAt: Date.now() }; // optional timestamp
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useStateStore = () => {
  const [localState, setLocalState] = useState(state);

  useEffect(() => {
    const update = () => setLocalState({ ...state });
    return subscribe(update);
  }, []);

  return [localState, setStateStore, removeStateStore] as const;
};