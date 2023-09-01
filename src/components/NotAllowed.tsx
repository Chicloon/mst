import React from 'react';
import { Alert, PcapTheme } from '@pcapcc360/react-ui';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: PcapTheme) => ({
  notAllowedWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}));

const NotAllowed = () => {
  const classes = useStyles();
  return (
    <div className={classes.notAllowedWrapper}>
      <Alert type="error" title="Доступ к данному разделу запрещен" children="У вас нет прав" />
    </div>
  );
};

export default NotAllowed;
