import React from 'react';
import useStyles from '../styles';
import { PlanItemInstance, useMst } from 'models';
import { breakNumberIntoGroups } from 'utils/functions';
import { CellProps } from './types';
import { observer } from 'mobx-react-lite';

const PlanTotalCell: React.FC<CellProps<PlanItemInstance>> = ({ data, accessor }) => {
  const {
    table: { fontSize },
  } = useMst().plan;
  const value = data[accessor];
  const classes = useStyles({});

  const displayValue = breakNumberIntoGroups(value);

  const className = `${classes.editCell} ${classes.borderWrapper} ${classes['color-31']}`;
  return (
    <div style={{ cursor: 'default', fontSize }} className={className}>
      {displayValue}
    </div>
  );
};

export default observer(PlanTotalCell);
