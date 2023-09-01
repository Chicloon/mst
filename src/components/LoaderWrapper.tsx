import { makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { LoadingIndicator, Typography } from '@pcapcc360/react-ui';

type LoaderWrapperProps = {
  content: ReactNode;
  noData?: boolean;
  loading: boolean;
};

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
  },
  loaderWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  loadingContent: {
    opacity: 0.3,
  },
  noDataWrapper: {
    width: '100%',
    '& > p': {
      textAlign: 'center',
    },
  },
  noDataContent: {
    opacity: 0,
  },
}));

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({ content, loading, noData = false }: LoaderWrapperProps) => {
  const classes = useStyles();

  const noDataMessage = (
    <Typography variant="body1semibold"> Нет данных, удовлетворяющих выбранным фильтрам </Typography>
  );
  if (loading) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.loaderWrapper}>{loading && <LoadingIndicator />}</div>
        <div className={classes.loadingContent}>{content} </div>
      </div>
    );
  }

  if (noData) {
    return (
      <div className={classes.wrapper}>
        <div className={`${classes.loaderWrapper} ${classes.noDataWrapper} `}>{noDataMessage}</div>
        <div className={classes.noDataContent}>{content} </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default LoaderWrapper;
