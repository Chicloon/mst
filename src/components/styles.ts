import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  const borderColor = theme.palette.info.main;

  return {
    quoteItem: {
      width: '200px',
      border: '1px solid grey',
      marginBottom: theme.spacing(1),
      backgroundColor: 'lightblue',
      padding: theme.spacing(1),
    },
    title: {
      backgroundColor: borderColor,
      borderRadius: '2px',
      padding: theme.spacing(0.5),
      wordBreak: 'break-all',
      maxWidth: '100%',
      textAlign: 'center',
      marginBottom: theme.spacing(1),
      '& > *': {
        color: theme.palette.primary.contrastText,
      },
    },
    link: {
      textDecoration: 'none',
      '& button:hover': {
        '& svg': {
          fill: theme.palette.primary.contrastText,
        },
      },
      '& button': {
        '& svg': {
          fill: theme.palette.primary.main,
        },
      },
    },
  };

});

export default useStyles;
