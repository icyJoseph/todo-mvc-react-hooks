import { useState, useEffect, useRef } from "react";

const noop = () => {};

export function useLocalStorage(key, fallback = "", onChange = noop) {
  const existingKey = localStorage.getItem(key);
  const init = !!existingKey ? JSON.parse(existingKey) : fallback;
  const [value, setValue] = useState(init);

  // content is the new value
  const modifyValue = content => setValue(content);

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  useEffect(() => {
    const handler = onChangeRef.current;
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  });

  return [value, modifyValue];
}

export default useLocalStorage;
