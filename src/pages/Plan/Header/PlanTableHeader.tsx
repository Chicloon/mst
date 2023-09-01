import React from 'react';
import Filters from './PlanFilters';
import PlanActions from './PlanActions';
import useStyles from './styles';
import { LoadingIndicator, Paper } from '@pcapcc360/react-ui';
import { Grid } from '@material-ui/core';
import { useMst } from 'models';
import { observer } from 'mobx-react-lite';
import PlanActionFilters from './PlanActionFilters';
import PlanFilterControls from './PlanFilterControls';

const PlanTableHeader = () => {
  const {
    header: { isInit },
  } = useMst().plan;
  const classes = useStyles();

  if (!isInit) {
    <LoadingIndicator />;
  }

  return (
    <Paper style={{ padding: '.5rem', flexGrow: 1 }}>
      <div className={classes.headerWrapper}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            {isInit ? <Filters /> : <LoadingIndicator />}
          </Grid>

          <Grid item xs={3}>
            <div className={classes.planActionsWrapper}>
              <PlanActions />
              <PlanActionFilters />
              <PlanFilterControls />
            </div>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default observer(PlanTableHeader);
