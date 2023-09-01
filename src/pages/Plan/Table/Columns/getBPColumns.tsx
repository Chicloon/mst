import { PlanItemInstance, useMst } from 'models';
import React from 'react';
import useStyles from '../styles';
import { PlanArticleCell, PlanBasicCell, PlanOrgCell } from '../Cells';
import { PlanTableInstance } from 'models/Plan/PlanTable';
import getDataColumns from './getDataColumns';
import getXoGkmBranchColumns from './getXoGkmColumns';
import { ColumnItem } from '../types';

const getBPColumns = ({ headers, type, tableItems: items }: PlanTableInstance) => {
  const {
    plan: {
      table: { scaleCoefficient },
    },
  } = useMst();
  const classes = useStyles({});

  const xoGkmBranchColumns = getXoGkmBranchColumns({ classes }) as ColumnItem<
    (typeof items)[0]
  >[];

  const dataColumns = getDataColumns({ headers, classes, type });

  const mainColumns = () => {
    const res = [];

    const columns = [
      {
        Header: () => (
          <div
            className={classes.articlesHeader}
            style={{ width: `calc(29.5rem / ${scaleCoefficient})` }}
          >
            Статья продукта
          </div>
        ),
        accessor: 's_article_lvl1_name',
        minWidth: 100,
        width: 100,
        disableResizing: true,
        sticky: 'left',
        customHeaderCellClass: classes.noBackgroundAndBorder,
        customPlaceholderCellClass: classes.noBackgroundAndBorder,
        Cell: (
          data: PlanItemInstance,
          accessor: keyof PlanItemInstance,
          rowIdx: number
        ) => <PlanArticleCell data={data} accessor={accessor} showHint rowIdx={rowIdx} />,
      },
      {
        Header: '',
        minWidth: 200,
        width: 200,
        accessor: 's_article_lvl2_name',
        sticky: 'left',
        disableResizing: true,
        customHeaderCellClass: classes.noBackgroundAndBorder,
        customPlaceholderCellClass: classes.noBackgroundAndBorder,
        Cell: (
          data: PlanItemInstance,
          accessor: keyof PlanItemInstance,
          rowIdx: number
        ) => <PlanArticleCell data={data} accessor={accessor} showHint rowIdx={rowIdx} />,
      },
      {
        Header: '',
        minWidth: 170,
        width: 170,
        accessor: 's_article_lvl3_name',
        align: 'center',
        sticky: 'left',
        disableResizing: true,
        customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
        Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance) => (
          <PlanBasicCell data={data} accessor={accessor} showHint />
        ),
      },
    ];

    if (type === 'inn') {
      res.push({
        Header: 'Организация',
        minWidth: 110,
        width: 10,
        id: 'organization',
        sticky: 'left',
        accessor: 'id_org_code',
        disableResizing: true,
        customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        Cell: (
          data: PlanItemInstance,
          accessor: keyof PlanItemInstance,
          rowIdx: number
        ) => {
          return <PlanOrgCell data={data} accessor={accessor} rowIdx={rowIdx} />;
        },
      });
    }
    res.push(...columns);

    if (type === 'inn') {
      res.push({
        Header: 'ТБ',
        accessor: 'i_tb_name_min',
        minWidth: 50,
        width: 50,
        disableResizing: true,
        align: 'center',
        sticky: 'left',
        customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance) => (
          <PlanBasicCell data={data} accessor={accessor} />
        ),
      });
    }

    res.push({
      Header: 'Валюта',
      accessor: 's_currency_code',
      minWidth: 70,
      width: 70,
      align: 'center',
      disableResizing: true,
      customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
      customPlaceholderCellClass: classes.customPlaceholderCellClass,
      sticky: 'left',
      Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance) => (
        <PlanBasicCell data={data} accessor={accessor} />
      ),
    });

    if (type === 'branch') {
      res.unshift({
        Header: 'Направление',
        accessor: 's_branch_name',
        minWidth: 100,
        width: 100,
        align: 'center',
        disableResizing: true,
        customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
        customPlaceholderCellClass: classes.customPlaceholderCellClass,
        sticky: 'left',
        Cell: (
          data: PlanItemInstance,
          accessor: keyof PlanItemInstance,
          rowIdx: number
        ) => <PlanArticleCell data={data} accessor={accessor} rowIdx={rowIdx} />,
      });
    }

    return res as ColumnItem<(typeof items)[0]>[];
  };

  const columns = [
    {
      Header: '',
      id: 'total',
      sticky: 'left',
      customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
      customPlaceholderCellClass: classes.customPlaceholderCellClass,
      disableResizing: true,
      removeHeadCellClasses: true,
      align: 'center',
      static: true,

      columns: mainColumns(),
    },
  ] as ColumnItem<(typeof items)[0]>[];

  if (headers?.showXO && type === 'inn') {
    columns[0].columns.unshift(...xoGkmBranchColumns);
  }

  columns.push(...dataColumns);

  return columns;
};

export default getBPColumns;
