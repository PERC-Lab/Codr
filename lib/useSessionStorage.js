import { useLayoutEffect, useState } from "react";

export const useSessionStorage = (key, defaultVal) => {
  const [localItem, setLocalItem] = useState(defaultVal);

  const setItem = (key, val) => {
    window.sessionStorage.setItem(key, val);
    setLocalItem(item)
  };

  useLayoutEffect(() => {
    const item = window.localStorage.getItem(key);
    item && setTheme(item);
  }, []);

  return [localItem, setItem];
};
