import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

const useStyles = makeStyles<PcapTheme>((theme) => {
  return {
    basicCell: {
      cursor: 'default',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      padding: `0 ${theme.spacing(0.5)}px`,
      wordBreak: 'break-all',
      whiteSpace: 'pre',
      overflow: 'hidden',
    },
    editCell: {
      cursor: 'context-menu',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      padding: `0 ${theme.spacing(0.5)}px`,
    },
    inputWrapper: {
      position: 'absolute',
      zIndex: 100,
      width: '100%',
      boxShadow: '0 0 8px 0px',
      borderRadius: '4px',
      scale: '1.1',
    },
    inputWrapperError: {
      boxShadow: `0 0 8px 0px ${theme.pcapPalette.error.main}`,
      border: `1px solid ${theme.pcapPalette.error.main}`,
    },

    inputIcon: {
      position: 'absolute',
      top: 6,
      right: 3,
      cursor: 'pointer',

      '& svg': {
        fill: theme.pcapPalette.text.primary,
      },
      '& svg:hover': {
        fill: theme.pcapPalette.text.secondary,
      },
    },

    borderWrapper: {
      boxShadow: `inset 0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    },
  };
});

export default useStyles;
