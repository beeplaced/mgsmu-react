# MGSMU - Minimal Global State Management Utility

- MGSMU is a lightweight global state management utility for React.  
- It provides a simple **publish-subscribe (pub-sub)** mechanism to manage global state without external libraries like Redux or Zustand.  
- Components can subscribe to specific keys and automatically re-render when those keys change.

## Import in any component

```ts
import { useStateStore, setStateStore, removeStateStore } from '../UseStore';
```
- useStateStore() – React hook to access the global state and subscribe to changes.
- setStateStore(entry, key) – Updates a specific key in the global store.
- removeStateStore(key) – Removes a key from the global store.

## Set data and key

```ts
const data = { specifics: "data", state: true, what: "next" };
const key = 'data';
setStateStore(key, data);
```

- Key: any string can be used ("data", "users", "messages", etc.)
- Data: any object or array can be stored under that key.
- This allows you to manage multiple independent keys in your global state.

## Invoke state
```ts
const [windowState] = useStateStore();
```

## Listen and catch changes

```ts
useEffect(() => {
  if (!windowState?.data) return;
  console.log(windowState);
}, [windowState.data]);

```

- useEffect triggers whenever the specified key (data in this example) changes.
- Supports multiple keys — you can set up multiple useEffect hooks to listen to different keys individually.
- Ensures components only re-render when the relevant slice of state updates.

## Remove keys

```ts
removeStateStore("data", "nextKey");
```

- Deletes a key from the global state.
- Triggers re-render for components subscribed to that key.
- Useful for cleaning up or resetting parts of your state dynamically.

----
**Notes**

- Every state update includes an updatedAt timestamp.
- The store works with any object structure, making it flexible for various use cases.
- Lightweight and minimal — no context providers or extra boilerplate required.
- Ideal for managing small to medium app state where a full state library would be overkill.