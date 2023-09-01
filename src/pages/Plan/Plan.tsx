import { makeStyles } from '@material-ui/core';
import { LoadingIndicator, PcapTheme } from '@pcapcc360/react-ui';
import { BASE_URL } from 'api/constants';
import { observer } from 'mobx-react-lite';
import { useMst } from 'models';
import React, { useEffect } from 'react';
import { Route, useParams, Switch, useLocation } from 'react-router-dom';
import PlanTableHeader from './Header/PlanTableHeader';
import { PlanTable } from './Table';

export const CELL_HEIGHT = 25;

const useStyles = makeStyles((theme: PcapTheme) => ({
  tableWrapper: {
    marginTop: theme.spacing(1),
    height: '100%',
    width: '100%',
  },
  planWrapper: {
    marginTop: theme.spacing(1),
    width: 'calc(100vw - 75px)',
    position: 'relative',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

const Plan: React.FC = () => {
  const {
    plan: { isInit, init, clearData },
  } = useMst();
  const { id } = useParams<{ id: string; type: string }>();
  const classes = useStyles();

  useEffect(() => {
    init(parseInt(id));
    return () => {
      clearData();
    };
  }, []);

  if (!isInit) {
    return <LoadingIndicator />;
  }

  return (
    <div className={classes.planWrapper}>
      <PlanTableHeader />

      <div className={classes.tableWrapper}>
        <Switch>
          <Route path={`${BASE_URL}/plan/:id/:type`} render={() => <PlanTable />} />
        </Switch>
      </div>
    </div>
  );
};

export default observer(Plan);
