import { useState, useEffect } from "react";

export function useLocalStorage(key, fallback = "") {
  const existingKey = localStorage.getItem(key);
  const init = !!existingKey ? JSON.parse(existingKey) : fallback;
  const [value, setValue] = useState(init);

  // content is the new value
  const modifyValue = content => setValue(content);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, modifyValue];
}

export default useLocalStorage;
