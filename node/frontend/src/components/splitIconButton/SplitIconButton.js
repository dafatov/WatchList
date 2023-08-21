import {memo, useState} from 'react';
import {IconButton} from '@mui/material';

export const SplitIconButton = memo(({
  disabled,
  mainIcon,
  topIcon,
  bottomIcon,
  onTopClick,
  onBottomClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {isHovered && !disabled
        ? <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '52px',
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IconButton
            color="primary"
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              border: '1px solid',
              borderLeft: 0,
              borderRadius: 0,
              borderTopRightRadius: '12px',
            }}
            onClick={() => onTopClick?.()}
          >
            {topIcon}
          </IconButton>
          <IconButton
            color="primary"
            style={{
              paddingTop: 1,
              paddingBottom: 0,
              border: '1px solid',
              borderLeft: 0,
              borderTop: 0,
              borderRadius: 0,
              borderBottomRightRadius: '12px',
            }}
            onClick={() => onBottomClick?.()}
          >
            {bottomIcon}
          </IconButton>
        </div>
        : <IconButton
          style={{
            border: '1px solid',
            borderLeft: 0,
            borderRadius: '0 12px 12px 0',
            minHeight: '52px',
          }}
          color="primary"
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
        >
          {mainIcon}
        </IconButton>}
    </>
  );
});

SplitIconButton.displayName = 'SplitIconButton';
