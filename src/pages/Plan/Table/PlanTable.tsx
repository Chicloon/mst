import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, List, ListRowProps, ScrollParams } from 'react-virtualized';
import { getBPColumns } from './Columns';
import { useParams } from 'react-router-dom';
import TableHeader from './TableHeader';
import { observer } from 'mobx-react-lite';
import useStyles from './tableStyles';
import { BPtypes, LoadStatuses, useMst } from 'models';
import TableStates from './TableStates';
import { ColumnItem } from './types';

const Table = () => {
  const { type } = useParams<{ type: BPtypes }>();

  const {
    table: {
      setType,
      state,
      tableItems: items,
      nextPage,
      setScroll,
      pagination: { perPage },
      cellHeight,
      scaleCoefficient,
    },

    table,
  } = useMst().plan;

  const columns = getBPColumns(table);

  const [loading, setLoading] = useState(false);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  const scrollBarWidth = useMemo(() => {
    let el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    let width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  }, []);

  const tableParams = useMemo(() => {
    const flatten = columns.flatMap((col) => {
      if (col.columns && columns.length > 0) {
        return col.columns;
      }
      return col;
    });
    const stickyColumns: ColumnItem<any>[] = [];
    const scrollableColumns: ColumnItem<any>[] = [];
    let stickyWidth = 0;
    let tableWidth = 0;

    flatten.forEach((el) => {
      if (el.sticky) {
        stickyColumns.push(el);
      } else {
        scrollableColumns.push(el);
      }

      tableWidth += el.minWidth / scaleCoefficient;
    });

    stickyColumns.forEach((el) => (stickyWidth += el.minWidth / scaleCoefficient));

    return {
      stickyColumns,
      scrollableColumns,
      stickyWidth,
      tableWidth,
    };
  }, [items.length, columns.length, columns[0]?.columns?.length, scaleCoefficient]);

  const onWrapperScroll = useCallback(() => {
    if (tableWrapperRef.current) {
      const { offsetWidth, scrollLeft } = tableWrapperRef.current;
      const tableRows = listWrapperRef.current?.children[0]?.children[0].children!;
      const scrollPercent = scrollLeft / offsetWidth;
      const header = tableWrapperRef.current.children[0];
      const left = tableParams.stickyWidth - scrollLeft + scrollPercent;

      if (tableRows && tableRows.length > 0) {
        for (const el of tableRows) {
          el.children[0].children[1].attributes[1].value = el.children[0].children[1].attributes[1].value
            .split(';')
            .map((el, idx) => {
              if (idx === 1) {
                return `left: ${left}px`;
              } else {
                return el;
              }
            })
            .join(';');
        }
        header.scrollTo({ left: scrollLeft });
      }
    }
  }, [state, columns.length, tableParams.stickyWidth]);

  const classes = useStyles({
    width: tableParams.tableWidth,
    cellHeight: cellHeight,
    height: cellHeight,
  });

  useEffect(() => {
    setType(type);
  }, [type]);

  useEffect(() => {
    tableWrapperRef.current?.addEventListener('scroll', onWrapperScroll);
    return () => {
      tableWrapperRef.current?.removeEventListener('scroll', onWrapperScroll);
    };
  }, [state, tableParams.stickyWidth]);

  if (state === LoadStatuses.pending || state === LoadStatuses.error) {
    return <TableStates state={state} />;
  }

  if (items.length === 0) {
    return <TableStates state="notFound" />;
  }

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const { stickyColumns, scrollableColumns, stickyWidth } = tableParams;

    const row = (
      <div key={key} className={classes.rowWrapper} style={style}>
        <div className={classes.innerRowWrapper}>
          <div className={classes.sticky} style={{ width: stickyWidth }}>
            {stickyColumns.map((el, idx) => {
              return (
                <div style={{ width: el.minWidth / scaleCoefficient }} key={idx + 'sticky_column'}>
                  {el.Cell(items[index], el.accessor, index)}
                </div>
              );
            })}
          </div>
          <div className={classes.scrollable} style={{ position: 'absolute', left: stickyWidth }}>
            {scrollableColumns.map((el, idx) => {
              return (
                <div style={{ width: el.minWidth / scaleCoefficient }} key={idx + 'scrollable_columns'}>
                  {el.Cell(items[index], el.accessor, index)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    return row;
  };

  const onTableScroll = async (args: ScrollParams) => {
    onWrapperScroll();
    const { scrollTop, scrollHeight } = args;
    scrollHeight && setScroll(scrollTop);

    if (type !== 'inn') {
      return;
    }

    if (scrollTop >= scrollHeight - 9 * perPage) {
      if (!loading) {
        setLoading(true);
        await nextPage();
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', opacity: loading ? '.3' : '1' }}>
      <AutoSizer>
        {({ width: widthWithScroll, height }) => {
          const width = widthWithScroll;
          return (
            <div
              ref={tableWrapperRef}
              style={{
                width,
                height,
                overflowY: 'hidden',
                overflowX: 'scroll',
              }}
            >
              <TableHeader
                tableWidth={width}
                headerWidth={tableParams.tableWidth}
                scrollBarWidth={scrollBarWidth}
                cellHeight={cellHeight}
                columns={columns}
              />
              <div
                style={{
                  width: `${tableParams.tableWidth}px`,
                  marginTop: cellHeight * 2,
                }}
              >
                <div className={classes.listWrapper} style={{ width: `${width}px` }} ref={listWrapperRef}>
                  <List
                    height={height}
                    rowCount={items.length}
                    rowHeight={cellHeight}
                    onScroll={onTableScroll}
                    rowRenderer={rowRenderer}
                    width={width}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default observer(Table);
