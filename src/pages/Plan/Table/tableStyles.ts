import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

import { CELL_HEIGHT } from '../Plan';

const useStyles = makeStyles<
  PcapTheme,
  Partial<{ height: number; width: number; cellHeight: number }>
>((theme) => {
  return {
    header: {
      display: 'flex',
      height: '100%',
      boxShadow: `inset 0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    },
    headerWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    cell: {
      padding: 0,
      margin: 0,
      background: theme.pcapPalette.background.default,
      height: ({ height }) => `${height ? height : CELL_HEIGHT}px`,
    },
    borderWrapper: {
      boxShadow: `0px 0px 0px 1px ${theme.pcapPalette.grey[500]}`,
    },
    innerHeader: {
      background: '1px solid black',
    },

    tableHeader: {
      display: 'flex',
      position: 'sticky',
      height: ({ height }) => `${height ? height * 2 : CELL_HEIGHT * 2}px`,
      zIndex: 3,
      top: 0,
      left: 0,
    },
    leftSideGrid: {
      overflow: 'hidden !important',
    },
    headerGrid: {
      width: '100%',
      overflow: 'hidden !important',
    },

    // New table styles

    innerRowWrapper: {
      display: 'flex',
      width: ({ width }) => width,
    },
    sticky: {
      height: ({ cellHeight }) => cellHeight,
      width: '10rem',
      position: 'sticky',
      left: 0,
      display: 'flex',
      zIndex: theme.zIndex.appBar,
      background: theme.pcapPalette.background.paper,
    },

    scrollable: {
      background: theme.pcapPalette.background.paper,
      height: ({ cellHeight }) => cellHeight,
      flexGrow: 1,
      display: 'flex',
    },
    listWrapper: {
      position: 'sticky',
      left: 0,
      top: 0,
    },
  };
});

export default useStyles;
