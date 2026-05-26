import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return { ...initialValue, ...parsed };
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`LocalStorage read error for key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`LocalStorage write error for key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}