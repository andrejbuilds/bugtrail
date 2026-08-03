import { useEffect, useState } from "react";

function getStoredValue(key, initialValue) {
  try {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch {
    return initialValue;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getStoredValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
