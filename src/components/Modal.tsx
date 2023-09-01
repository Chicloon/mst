import React, { useCallback } from 'react';
import { Modal, PcapTheme } from '@pcapcc360/react-ui';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { AdminAddNewFilterNames, useMst } from 'models';
import { Filter } from 'components';
import dayjs from 'dayjs';
import { ModalInstance } from 'models/Modal';

const useStyles = makeStyles<PcapTheme, { width: string }>((theme) => ({
  modalWrapper: {
    height: ({ width }) => (width == 'xl' ? '30vh' : '20vh'),
    width: ({ width }) => (width === 'xl' ? '40vw' : '30vw'),
  },
  dateWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  label: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
    '& > p': {
      textAlign: 'end',
      width: '100%',
    },
  },
}));

type ModalProps = {
  model: ModalInstance;
  children: any;
};

const AdminAddNewModal: React.FC<ModalProps> = ({ model, children }) => {
  const { isOpen, close, title, size } = model;
  const classes = useStyles({ width: size });

  return (
    <Modal
      open={isOpen}
      onClose={close}
      contentClassName={classes.modalWrapper}
      title={title}
      maxWidth="xl"
    >
      {children}
    </Modal>
  );
};

export default observer(AdminAddNewModal);
