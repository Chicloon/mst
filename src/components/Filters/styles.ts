import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

const useStyles = makeStyles((theme: PcapTheme) => ({
  wrapper: {
    display: 'flex',
  },
  label: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dropDown: {
    flexGrow: 1,
  },
}));

export default useStyles;
