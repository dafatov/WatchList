import {useCallback, useState} from 'react';

export const useLocalStorage = key => {
  const [valueState, setValueState] = useState(JSON.parse(localStorage.getItem(key)));

  const setValue = useCallback(value => {
    setValueState(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, setValueState]);

  return [valueState, setValue];
};
