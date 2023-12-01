import {useCallback, useState} from 'react';

export const useLocalStorage = key => useStorage(key, localStorage);

export const useSessionStorage = key => useStorage(key, sessionStorage);

const useStorage = (key, storage) => {
  const [valueState, setValueState] = useState(JSON.parse(storage.getItem(key)));

  const setValue = useCallback(value => {
    setValueState(value);
    storage.setItem(key, JSON.stringify(value));
  }, [key, setValueState]);

  return [valueState, setValue];
};
