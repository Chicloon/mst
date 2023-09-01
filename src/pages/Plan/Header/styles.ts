import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  paperWrapper: {
    // position: 'absolute',
    width: `calc(100% - ${theme.spacing(2)}px)`,
    top: 0,
    left: theme.spacing(1),
    padding: theme.spacing(1),
    zIndex: 10,
    transition: 'height 1s',
  },
  headerWrapper: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    transition: 'height 1s',
  },
  filterGroupWrapper: {
    '& > div  > div:not(:first-child)': {
      marginTop: theme.spacing(0.5),
    },
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'end',
  },
  actionButtonsWrapper: {
    '& > div:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  planTypesButtonsWrapper: {
    marginRight: theme.spacing(1),

    '& > button:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  expandButtonWrapper: {
    display: 'flex',
    alignSelf: 'end',
    justifyContent: 'end',
    flexGrow: 1,
    alignItems: 'end',
    // paddingBottom: '20px',
    '& > div': {
      marginLeft: theme.spacing(1),
    },
  },
  restFiltersWrapper: {
    opacity: 0,
    // transition: 'opacity 1s',
  },
  bottomActionsWrapper: {
    display: 'flex',
    // gap: theme.spacing(0.5),
  },
  planActionsWrapper: {
    // display: 'flex',
    display: 'grid',
    flexDirection: 'column',
    height: '100%',
  },
  planActionsFiltersWrapper: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'end',
  },
  filterRowWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    '& > div': {
      width: '23vw',
    },
  },
  tbWrapper: {
    width: '12vw !important',
  },
  vkoWrapper: {
    // flexBasis: '32%',
    width: '34vw !important',
  },
  perPageWrapper: {
    marginRight: theme.spacing(1),
    '& .select__control': {
      height: '2.2rem',
    },
  },
  scaleWrapper: {
    width: '5rem !important',
    marginRight: theme.spacing(1),
    '& .select__control': {
      height: '2.2rem',
      width: '5rem',
    },
  },
}));

export default useStyles;
