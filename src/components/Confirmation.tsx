import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Button, Paper, Typography, Modal, PcapTheme } from '@pcapcc360/react-ui';
import { observer } from 'mobx-react-lite';
import { useMst } from '../models/Root';

const useStyles = makeStyles((theme: PcapTheme) => ({
  confirmation: {
    '& div[role=dialog]': {
      width: '50%',
    },
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
}));

const Confirmation = () => {
  const classes = useStyles();
  const {
    ui: { confirmation },
  } = useMst();

  const { onConfirm, content, onCancel } = confirmation;

  const actions = (
    <>
      <Button
        variant="contained"
        onClick={() => {
          onConfirm();
        }}
      >
        Да
      </Button>
      <Button variant="outlined" onClick={onCancel}>
        Отмена
      </Button>
    </>
  );

  return (
    <Modal
      onClose={() => {
        onCancel();
        confirmation.hideConfirmation();
      }}
      open={confirmation.show}
      modalClassName={classes.confirmation}
      actions={actions}
      title="Подтвердите действие"
      titleClassName={classes.confirmation}
      contentClassName={classes.content}
    >
      {content}
    </Modal>
  );
};

export default observer(Confirmation);
