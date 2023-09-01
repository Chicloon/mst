import React, { FC } from 'react';
import { Paper, PcapTheme, Typography } from '@pcapcc360/react-ui';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: PcapTheme) => ({
  wrapper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));
type PageHeaderProps = {
  title: string;
};

const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  const classes = useStyles();
  return (
    <Paper>
      <div className={classes.wrapper}>
        <Typography variant="h1">{title}</Typography>
      </div>
    </Paper>
  );
};

export default PageHeader;
