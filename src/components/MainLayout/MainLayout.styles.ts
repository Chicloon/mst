import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: 'calc(100vw - 90px)',
    height: 'calc(100vh - 60px)',
    // overflow: 'auto',
    overflow: 'hidden',
  },
  routesWrapper: {
    height: '100%',
    width: '100%',
  },
  navHeader: {
    display: 'flex',
  },
  appHeaderWrapper: {},
  navigationTabs: {
    marginLeft: 'auto',
  },
  wrapper: {},
  filters: {},
  filtersUpper: { marginBottom: theme.spacing(2) },
  filtersLower: {},
  factPrognosisWrapper: { marginLeft: theme.spacing(2) },
}));

export default useStyles;
