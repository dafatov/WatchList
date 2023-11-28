import {FileDownloadOutlined, FileUploadOutlined} from '@mui/icons-material';
import {memo, useState} from 'react';
import {ChooseShikimoriNicknameModal} from './chooseShikimoriNicknameModal/ChooseShikimoriNicknameModal';
import {ReactComponent as ShikimoriIcon} from '../../../assets/icons/shikimori.svg';
import {SplitIconButton} from '../../splitIconButton/SplitIconButton';
import {SvgIcon} from '@mui/material';

export const Shikimori = memo(({
  onImport,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SplitIconButton
        mainIcon={<SvgIcon component={ShikimoriIcon}/>}
        leftIcon={<FileUploadOutlined/>}
        rightIcon={<FileDownloadOutlined/>}
        onLeftClick={() => setOpen(true)}
      />
      <ChooseShikimoriNicknameModal
        open={open}
        setOpen={setOpen}
        onSubmit={onImport}
      />
    </>
  );
});

Shikimori.displayName = 'Shikimori';
