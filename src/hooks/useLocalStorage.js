import { useState, useEffect } from "react";

export function useLocalStorage(key, fallback = "") {
  const existingKey = localStorage.getItem(key);
  const init = !!existingKey ? JSON.parse(existingKey) : fallback;
  const [value, setValue] = useState(init);

  // content is the new value

  const setStore = (value) => localStorage.setItem(key, JSON.stringify(value));

  useEffect(() => {
    const handler = (e) => {
      setValue(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return [value, setStore];
}
