import React from 'react';
import { ClassNameMap } from '@material-ui/styles';
import { PlanItemInstance } from 'models';
import { PlanArticleCell } from '../Cells';

const getXoGkmBranchColumns = ({ classes }: { classes: ClassNameMap<string> }) => [
  {
    Header: 'Направление',
    accessor: 'branch_name',
    minWidth: 100,
    width: 100,
    align: 'center',
    disableResizing: true,
    customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
    sticky: 'left',
    Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance, rowIdx: number) => (
      <PlanArticleCell data={data} accessor={accessor} rowIdx={rowIdx} />
    ),
  },
  {
    Header: 'Группа',
    accessor: 'xo_name',
    minWidth: 100,
    width: 100,
    disableResizing: true,
    align: 'center',
    sticky: 'left',
    customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
    Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance, rowIdx: number) => (
      <PlanArticleCell data={data} accessor={accessor} rowIdx={rowIdx} />
    ),
  },
  {
    Header: 'ГКМ',
    accessor: 'gkm_name',
    minWidth: 100,
    width: 100,
    align: 'center',
    disableResizing: true,
    customHeaderCellClass: `${classes['color-26']} ${classes.customHeaderCellClass}`,
    sticky: 'left',
    Cell: (data: PlanItemInstance, accessor: keyof PlanItemInstance, rowIdx: number) => (
      <PlanArticleCell data={data} accessor={accessor} rowIdx={rowIdx} />
    ),
  },
];

export default getXoGkmBranchColumns;
