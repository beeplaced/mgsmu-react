import { useEffect, useState } from 'react';

type StateEntry = {
  [key: string]: any;
  updatedAt?: number;
};

type State = {
  [key: string]: StateEntry | number; // allow `updatedAt` as number
};

let state: State = {};
const listeners: Map<string, Set<() => void>> = new Map();

// Get the full state
export const getState = (): State => state;

// Set or update a specific key in the state
export const setStateStore = (entry: StateEntry, key: string = "data"): void => {
  state = {
    ...state,
    [key]: {
      ...entry,
      updatedAt: Date.now(),
    },
  };
  listeners.get(key)?.forEach((listener) => listener());
};

// Remove one or multiple keys from the state
export const removeStateStore = (...keys: string[]): void => {
  const newState: State = { ...state };
  keys.forEach((key) => {
    delete newState[key];
  });
  state = { ...newState, updatedAt: Date.now() };
  listeners.forEach((set) => set.forEach((listener) => listener()));
};

// Subscribe to changes on a specific key
export const subscribeKey = (key: string, listener: () => void): (() => void) => {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)!.delete(listener);
};

// React hook to use the state
export const useStateStore = (key: string): [any, (v: any) => void, (...keys: string[]) => void] => {
  const [value, setValue] = useState<any>(state[key]);

  useEffect(() => {
    const update = () => setValue(state[key]);
    const unsubscribe = subscribeKey(key, update);
    return () => {
      unsubscribe();
    };
  }, [key]);

  return [value, (v: any) => setStateStore(v, key), removeStateStore];
};
