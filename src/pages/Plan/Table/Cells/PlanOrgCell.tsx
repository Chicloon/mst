import React, { useCallback, useEffect, useMemo } from 'react';
import { Hint, Typography, PcapTheme } from '@pcapcc360/react-ui';
import { observer } from 'mobx-react-lite';
import { PlanItemInstance, useMst } from 'models';
import { CELL_HEIGHT } from 'pages/Plan/Plan';
import { CellProps } from './types';
import { useTheme } from '@material-ui/core';
import { CorrectionAgreement } from './CorrectionAgreement';
import { getSnapshot } from 'mobx-state-tree';

const PlanOrgCell: React.FC<CellProps<PlanItemInstance>> = ({
  data,
  accessor,
  rowIdx,
}) => {
  const {
    plan: {
      table: { scrolledBy, type, correctionStatus, cellHeight, fontSize },
      header: { displayCorrectionAgreement },
    },
  } = useMst();
  const item = data[accessor as keyof PlanItemInstance];
  const { value, height } = item;
  // const classes = useStyles({ height });
  const theme = useTheme<PcapTheme>();

  // const className = `${classes.verticalCell} ${classes.borderWrapper}`;
  const top = rowIdx ? (height - (rowIdx - scrolledBy / CELL_HEIGHT)) * CELL_HEIGHT : 0;
  const showCorrectionAgreement =
    type === 'inn' &&
    displayCorrectionAgreement &&
    correctionStatus.some((el) => el.orgId === data.id_org);

  const styles = {
    verticalCell: height
      ? {
          minWidth: 'calc(100% + 0px)',
          height: `${height && height * (cellHeight || CELL_HEIGHT)}px`,
          transform: `translateY(-${(height - 1) * (cellHeight || CELL_HEIGHT)}px)`,
          background: theme.pcapPalette.background.paper,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(0.5),
          textAlign: 'center',
        }
      : { display: 'none' },

    borderWrapper: {
      boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    },
  } as { [key: string]: React.CSSProperties };

  return (
    <div
      style={{
        ...styles.verticalCell,
        ...styles.borderWrapper,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          left: 0,
          padding: '4px',
          top: top < CELL_HEIGHT ? 0 : top,
        }}
      >
        {/* @ts-ignore next-line */}
        <Hint title={data.id_org_name || ''}>
          <Typography variant="body2">
            <span style={{ fontSize }}> {value}</span>
          </Typography>
        </Hint>
        {showCorrectionAgreement && <CorrectionAgreement data={data} />}
      </div>
    </div>
  );
};

// export default React.memo(PlanOrgCell);
export default observer(PlanOrgCell);
