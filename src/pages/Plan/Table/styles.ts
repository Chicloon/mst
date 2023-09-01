import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';

import { CELL_HEIGHT } from '../Plan';

const useStyles = makeStyles<PcapTheme>((theme) => {
  const colors = theme.pcapPalette.complimentary
    .map((el) => [el.main, el.secondary])
    .flat();

  return {
    wrapper: {
      position: 'relative',
      height: '90vh',
      overflow: 'auto',
    },
    cell: {
      padding: 0,
      margin: 0,
      border: '1px solid',
      borderTop: 'none',
      borderLeft: 'none',
      borderColor: theme.pcapPalette.grey[500],
      background: theme.pcapPalette.background.default,
      height: CELL_HEIGHT,
      // height: (props) => `${props.cellHeight ? props.cellHeight : CELL_HEIGHT}px`,
    },
    verticalCell: (props) => {
      return {
        minWidth: 'calc(100% + 0px)',
        height: CELL_HEIGHT,
        transform: `translateY(-${CELL_HEIGHT}px)`,
        background: theme.pcapPalette.background.paper,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0.5),
        textAlign: 'center',
      };
    },
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
      // textAlign: 'end',
      alignItems: 'center',
      padding: `0 ${theme.spacing(0.5)}px`,
    },
    inputWrapper: {
      position: 'absolute',
      zIndex: 100,
      width: '12rem',
      // left: '-3rem',
      boxShadow: '0 0 8px 0px',
      borderRadius: '4px',
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
    totalColumnClass: {
      background: colors[31],
    },

    customHeaderCellClass: {
      backgroundColor: theme.pcapPalette.complimentary[1].main,
      borderLeft: 'none',
      borderBottom: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,

      '&:hover': {
        backgroundColor: theme.pcapPalette.complimentary[1].main,
      },
    },

    customPlaceholderCellClass: {
      border: 0,
      '&:hover': {
        backgroundColor: `${theme.pcapPalette.primary[200]}!important`,
      },
    },
    articlesHeader: {
      position: 'absolute',
      width: '29.4rem',
      height: '100%',
      top: '0',
      left: 0,
      background: colors[26],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: `1px solid ${theme.pcapPalette.grey[500]}`,
      borderBottom: 'none',
    },
    noBackgroundAndBorder: {
      boxShadow: 'none',
      background: 'none',
      border: 'none',
      position: 'relative',
      // height: CELL_HEIGHT,

      '&:hover': {
        background: 'none',
        border: 'none',
      },
    },
    noBackground: {
      boxShadow: 'none',
      background: 'none',
      // height: ({ cellHeight }) => cellHeight || CELL_HEIGHT,
      height: CELL_HEIGHT,

      '&:hover': {
        background: 'none',
      },
    },
    customCommentCellClass: {
      background: 'red',
      padding: 0,
      margin: 0,
    },
    blankColumn: {
      background: theme.pcapPalette.background.default,
      boxShadow: 'none',
      borderTop: 'none',
      '&:hover': {
        background: theme.pcapPalette.background.default,
      },
    },
    blankCell: {
      width: '100%',
      // height: ({ cellHeight }) => cellHeight || CELL_HEIGHT,
      height: CELL_HEIGHT,
      borderBottom: 'none',
      background: theme.pcapPalette.background.default,
    },
    ...colors.reduce(
      (acc, curr, idx) => (
        (acc[`color-${idx}`] = {
          background: `${curr} !important`,
        }),
        acc
      ),
      {} as { [key: string]: { background: string } }
    ),

    borderWrapper: {
      boxShadow: `inset 0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    },
  };
});

export default useStyles;
