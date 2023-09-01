import { ClassNameMap } from '@material-ui/styles';
import { PlanItemInstance } from 'models';
import { BPtypes } from 'models/Plan';
import React from 'react';
import { PlanBasicCell, PlanCommentCell, PlanDataCell, PlanTotalCell } from '../Cells';
import { minWidth, width } from '../constants';
import { Header } from '../types';

const getDataColumns = ({
  headers,
  classes,
  type,
}: {
  type: BPtypes;
  headers: Header;
  classes: ClassNameMap<string>;
}) => {
  const dataColumns: any[] = [];

  if (!headers) {
    return [];
  }
  const headersArray = Object.entries(headers.data);

  headersArray.forEach((header, idx) => {
    let color: string | number = 0;
    let total: any = {};

    const columns = Object.entries(header[1]).flatMap((columnHeader: any) => {
      const headerArr = Object.values(columnHeader[1]) as [string, string, number];
      const accessor = headerArr[0];
      const headerName = headerArr[1];

      color = headerArr[2];

      if (accessor.endsWith('y')) {
        total = {
          accessor,
          headerName,
          color,
        };
      }

      const dataCellsInTbCa = ['plan_ca', 'plan_tb', 'plan_ca_9m', 'plan_tb_9m'] as any[];
      const dataHeaders = ['План ЦА', 'Предложение ТБ'];

      return {
        Header: headerName,
        minWidth,
        width,
        align: 'center',
        disableResizing: true,
        customHeaderCellClass: `${classes[`color-${color}`]} ${
          classes.customHeaderCellClass
        }`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        accessor,
        Cell: (
          data: PlanItemInstance,
          accessor: keyof PlanItemInstance,
          rowIdx: number
        ) => {
          if (!dataCellsInTbCa.includes(accessor) && dataHeaders.includes(header[0])) {
            return <PlanDataCell data={data} accessor={accessor} rowIdx={rowIdx} />;
          } else {
            return <PlanBasicCell data={data} accessor={accessor} />;
          }
        },
      };
    });

    dataColumns.push({
      Header: header[0],
      id: header[0][0],
      align: 'center',
      disableResizing: true,
      customHeaderCellClass: `${classes[`color-${color}`]} ${
        classes.customHeaderCellClass
      }`,
      customPlaceholderCellClass: classes.customPlaceholderCellClass,
      columns,
    });

    if (total && total.accessor) {
      columns.pop();

      dataColumns.push({
        Header: 'ИТОГО',
        align: 'center',
        disableResizing: true,
        id: total.accessor + 'total',
        customHeaderCellClass: `${classes[`color-30`]} ${classes.customHeaderCellClass}`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        columns: [
          {
            Header: total.headerName,
            align: 'center',
            minWidth,
            disableResizing: true,
            width,
            customHeaderCellClass: `${classes[`color-30`]} ${
              classes.customHeaderCellClass
            }`,
            customPlaceholderCellClass: classes.customPlaceholderCellClass,
            customCellClass: classes.totalColumnClass,
            accessor: total.accessor,
            Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance) => (
              <PlanTotalCell data={data} accessor={accessor} />
            ),
          },
        ],
      });
    }

    const blankWidth = 15;

    idx !== headersArray.length - 1 &&
      dataColumns.push({
        Header: '',
        id: idx + header[0],
        customHeaderCellClass: `${classes.blankColumn} ${classes.customHeaderCellClass}`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        disableResizing: true,
        columns: [
          {
            Header: '',
            id: idx + header[0] + 'col',
            width: blankWidth,
            minWidth: blankWidth,
            Cell: () => <div className={classes.blankCell}></div>,
            customHeaderCellClass: `${classes.blankColumn} ${classes.customHeaderCellClass}`,
            customPlaceholderCellClass: classes.customPlaceholderCellClass,
            disableResizing: true,
            removeHeadCellClasses: true,
            customCellClass: classes.blankCell,
            customColumnCellClass: classes.blankCell,
          },
        ],
      });

    if (header[0] === 'Предложение ТБ' && type === 'inn') {
      dataColumns.push(
        ...[
          {
            Header: 'К',
            align: 'center',
            disableResizing: true,
            accessor: 'comment',
            customHeaderCellClass: `${classes[`color-26`]} ${
              classes.customHeaderCellClass
            }`,
            columns: [
              {
                Header: '',
                id: idx + header[0] + 'col - comment',
                minWidth: 50,
                width: 100,
                disableResizing: true,
                customHeaderCellClass: `${classes[`color-26`]} ${
                  classes.customHeaderCellClass
                }`,
                Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance) => (
                  <PlanCommentCell data={data} accessor={accessor} />
                ),
              },
            ],
          },
          {
            Header: '',
            id: idx + header[0],
            customHeaderCellClass: `${classes.blankColumn} ${classes.customHeaderCellClass}`,
            customPlaceholderCellClass: classes.customPlaceholderCellClass,
            disableResizing: true,
            columns: [
              {
                Header: '',
                id: idx + header[0] + 'col',
                width: blankWidth,
                minWidth: blankWidth,
                Cell: () => <div className={classes.blankCell}></div>,
                customHeaderCellClass: `${classes.blankColumn} ${classes.customHeaderCellClass}`,
                customPlaceholderCellClass: classes.customPlaceholderCellClass,
                disableResizing: true,
                removeHeadCellClasses: true,
                customCellClass: classes.blankCell,
                customColumnCellClass: classes.blankCell,
              },
            ],
          },
        ]
      );

      if (idx === headersArray.length - 1) {
        dataColumns.pop();
      }
    }
  });
  return dataColumns;
};

export default getDataColumns;
