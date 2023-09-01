import { makeStyles } from '@material-ui/core';
import { PcapTheme, Typography } from '@pcapcc360/react-ui';
import React from 'react';
import { ColumnItem } from './types';
import { observer } from 'mobx-react-lite';
import { useMst } from 'models';

type TableHeaderProps = {
  tableWidth: number;
  headerWidth: number;
  scrollBarWidth: number;
  cellHeight: number;
  columns: ColumnItem<any>[];
};

const useStyles = makeStyles<
  PcapTheme,
  Partial<Pick<TableHeaderProps, 'tableWidth' | 'cellHeight' | 'scrollBarWidth' | 'headerWidth'>>
>((theme) => ({
  headerWrapper: {
    width: ({ tableWidth, scrollBarWidth }) => (tableWidth && scrollBarWidth ? tableWidth - scrollBarWidth : 0),
    height: ({ cellHeight }) => cellHeight,
    // background: 'gray',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    // overflow: 'scroll,
  },
  headerRowsWrapper: {
    display: 'flex',
    height: ({ cellHeight }) => cellHeight,
    width: ({ headerWidth }) => headerWidth,
  },
  sticky: {
    position: 'sticky',
    background: theme.pcapPalette.background.default,
    left: 0,
  },
  scrollable: {
    flexGrow: 1,
  },
}));

const TableHeader: React.FC<TableHeaderProps> = ({ tableWidth, headerWidth, scrollBarWidth, cellHeight, columns }) => {
  const {
    table: { fontSize, lineHeight, scaleCoefficient },
  } = useMst().plan;

  const stickyHeaders: any[] = [[], []];
  const scrollableHeaders: any[] = [[], []];

  const getHeaderRows = () => {
    const getHeaderSide = (sideHeaders: any[], header: ColumnItem<any>, idx: number) => {
      let columnWidth = 0;

      if (header.columns) {
        sideHeaders[1].push(
          header.columns.map((el, index) => {
            const headerValue =
              typeof el.Header === 'function' ? (
                el.Header()
              ) : (
                <Typography variant="body2">
                  <span style={{ fontSize, lineHeight }}>{el.Header}</span>
                </Typography>
              );

            columnWidth += el.minWidth / scaleCoefficient;
            return (
              <div
                key={'header-row' + idx + '-' + index}
                className={el.customHeaderCellClass}
                style={{
                  width: el.minWidth / scaleCoefficient,
                  display: 'flex',
                }}
              >
                {headerValue}
              </div>
            );
          })
        );
      }

      sideHeaders[0].push([
        <div
          style={{ width: columnWidth }}
          className={header.customHeaderCellClass}
          key={`tableHeader - ${header.id || header.accessor} - ${idx}`}
        >
          {header.Header}
        </div>,
      ]);
    };

    columns.forEach((header, idx) => {
      if (header.sticky) {
        getHeaderSide(stickyHeaders, header, idx);
      } else {
        getHeaderSide(scrollableHeaders, header, idx);
      }
    });
  };

  getHeaderRows();
  const classes = useStyles({
    tableWidth,
    headerWidth,
    scrollBarWidth,
    cellHeight: cellHeight * stickyHeaders.length,
  });

  const renderHeaderSide = (headers: any[], name: string) => {
    const key = name + 'header';
    return headers.map((el, idx) => (
      <div key={key + '-' + idx} style={{ display: 'flex', height: cellHeight }}>
        {el.map((subHeader: any, subIdx: number) => (
          <React.Fragment key={key + idx + 'subHeader' + subIdx}>{subHeader}</React.Fragment>
        ))}
      </div>
    ));
  };

  return (
    <div className={classes.headerWrapper} style={{ fontSize }}>
      <div className={classes.headerRowsWrapper}>
        <div className={classes.sticky}>{renderHeaderSide(stickyHeaders, 'sticky')}</div>
        <div className={classes.scrollable}>{renderHeaderSide(scrollableHeaders, 'scrollable')}</div>
      </div>
    </div>
  );
};

// export default React.memo(TableHeader);
export default observer(TableHeader);
