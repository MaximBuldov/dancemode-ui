import { useEffect, useState } from 'react';

const useDebounce = (value: string) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
