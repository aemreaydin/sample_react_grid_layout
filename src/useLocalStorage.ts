import React from "react";

type Props<T> = {
  key: string;
  initialValue?: T;
};

const useLocalStorage = <T>({
  key,
  initialValue,
}: Props<T>): [T | undefined, typeof setValue] => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse the item obtained from localStorage, or if null use the initial value
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState - cool!
      const valueToStore: T =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
export default useLocalStorage;
