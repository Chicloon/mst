import React from 'react';
import useStyles from '../styles';
import { PlanItemInstance, useMst } from 'models';
import { Hint, PcapTheme } from '@pcapcc360/react-ui';
import { useTheme } from '@material-ui/core';
import { breakNumberIntoGroups } from 'utils/functions';
import { CellProps } from './types';
import { observer } from 'mobx-react-lite';

const PlanBasicCell: React.FC<CellProps<PlanItemInstance>> = ({
  data,
  accessor,
  showHint = false,
}) => {
  const cellValue = data[accessor as keyof PlanItemInstance];

  const {
    table: { fontSize },
  } = useMst().plan;

  const theme = useTheme<PcapTheme>();

  const styles = {
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
    boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
  } as React.CSSProperties;

  const colors = theme.pcapPalette.complimentary
    .map((el) => [el.main, el.secondary])
    .flat();

  const cellColor = data.b_article_lvl3_color_row ? data.n_article_lvl3_color : null;
  const background = cellColor ? colors[cellColor - 1] : 'inherit';

  let value = Boolean(parseFloat(cellValue))
    ? breakNumberIntoGroups(cellValue)
    : cellValue;

  const displayValue = value === undefined ? 'n/a' : value === null ? '-' : value;

  return (
    <div style={{ background, fontSize, ...styles }}>
      {showHint ? (
        // @ts-ignore next-line
        <Hint title={displayValue}>
          <span style={{ fontSize }}>{displayValue} </span>
        </Hint>
      ) : (
        displayValue
      )}
    </div>
  );
};

export default observer(PlanBasicCell);
