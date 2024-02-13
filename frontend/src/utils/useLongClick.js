import {useEffect, useState} from 'react';

export const useLongClick = (onLongClick, onClick, delay = 300) => {
  const [isStartingLongClick, setIsStartingLongClick] = useState(false);
  const [isLongClicked, setIsLongClicked] = useState(false);

  useEffect(() => {
    let timerId = null;

    if (isStartingLongClick) {
      timerId = setTimeout(() => {
        onLongClick?.();
        setIsStartingLongClick(false);
        setIsLongClicked(true);
      }, delay);
    } else {
      clearTimeout(timerId);
    }

    return () => clearTimeout(timerId);
  }, [isStartingLongClick, onLongClick, delay, setIsStartingLongClick, setIsLongClicked]);

  return {
    onMouseDown: () => setIsStartingLongClick(true),
    onMouseUp: () => setIsStartingLongClick(false),
    onMouseLeave: () => setIsStartingLongClick(false),
    onTouchStart: () => setIsStartingLongClick(true),
    onTouchEnd: () => setIsStartingLongClick(false),
    onClick: () => {
      if (!isLongClicked) {
        onClick?.();
      }
      setIsLongClicked(false);
    },
  };
};
