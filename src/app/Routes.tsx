import React from 'react';
import { BASE_URL } from 'api/constants';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as Pages from 'pages';
import { useMst } from 'models';
import { observer } from 'mobx-react-lite';
import { LoadingIndicator } from '@pcapcc360/react-ui';
import { adminRoles, userRoles } from 'utils/constants';

const Routes: React.FC = () => {
  const { user } = useMst();
  if (!user.isInit) {
    return <LoadingIndicator />;
  }

  return (
    <Switch>
      {user.roleExistsAny([...adminRoles, ...userRoles]) && (
        <Route path={`${BASE_URL}/stages`} component={Pages.Stages} />
      )}
      {user.roleExistsAny(adminRoles) && (
        <Route path={`${BASE_URL}/stages_settings`} component={Pages.StagesSettings} />
      )}
      {user.roleExistsAny(adminRoles) && (
        <Route path={`${BASE_URL}/plan_settings/:id`} component={Pages.PlanSettings} />
      )}
      {user.roleExistsAny([...adminRoles, ...userRoles]) && (
        <Route path={`${BASE_URL}/plan/:id`} component={Pages.Plan} />
      )}
      <Route path="*">
        <Redirect to={`${BASE_URL}/stages`} />
      </Route>
    </Switch>
  );
};
export default observer(Routes);
