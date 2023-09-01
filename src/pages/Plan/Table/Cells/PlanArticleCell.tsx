import { useTheme } from '@material-ui/core';
import { Hint, PcapTheme, Typography } from '@pcapcc360/react-ui';
import React from 'react';
import useStyles from '../styles';
import { CellProps } from './types';
import { PlanItemInstance, useMst } from 'models';
import { observer } from 'mobx-react-lite';
import { CELL_HEIGHT } from 'pages/Plan/Plan';

const coloredBg = ['s_article_lvl1_name', 's_article_lvl2_name', 's_article_lvl4_name'];
const PlanArticleCell: React.FC<CellProps<PlanItemInstance>> = ({
  data,
  accessor,
  showHint = false,
  rowIdx,
}) => {
  const {
    plan: {
      table: { fontSize, scrolledBy, cellHeight },
    },
  } = useMst();
  const item = data[accessor as keyof PlanItemInstance];

  const { value, height } = item;
  const id = accessor as string;
  const start = `s_`;
  const end = `_name`;
  const articleName = id?.split(start)[1]?.split(end)[0];

  const color = articleName
    ? data[`n_${articleName}_color` as keyof PlanItemInstance]
    : 'inherit';
  // const classes = useStyles({ height, cellHeight });
  const theme = useTheme<PcapTheme>();
  const colors = theme.pcapPalette.complimentary.flatMap((el) => [el.main, el.secondary]);

  // const className = `${classes.verticalCell} ${classes.borderWrapper}`;

  const top = rowIdx ? (height - (rowIdx - scrolledBy / CELL_HEIGHT)) * CELL_HEIGHT : 0;

  const wrapperStyle = {
    minWidth: 'calc(100% + 0px)',
    height: `${height && height * (cellHeight || CELL_HEIGHT)}px`,
    transform: `translateY(-${(height - 1) * (cellHeight || CELL_HEIGHT)}px)`,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    textAlign: 'center',
    background: coloredBg.includes(id)
      ? colors[color - 1]
      : theme.pcapPalette.background.paper,
    whiteSpace: height === 1 ? 'nowrap' : 'inherit',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '20px',
    boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
  } as React.CSSProperties;

  return (
    <div style={wrapperStyle}>
      {height ? (
        <div
          style={{
            position: 'sticky',
            top: top < CELL_HEIGHT ? 0 : top,
            overflow: 'hidden',
          }}
        >
          {showHint ? ( // @ts-ignore
            <Hint title={value}>
              <Typography variant="body2">
                <span style={{ fontSize }}>{value}</span>
              </Typography>
            </Hint>
          ) : (
            <Typography variant="body2">
              <span style={{ fontSize }}>{value} </span>
            </Typography>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default observer(PlanArticleCell);
