import React, { ReactNode, useEffect } from 'react';
import useStyles from './MainLayout.styles';
import { observer } from 'mobx-react-lite';
import { LoadingIndicator } from '@pcapcc360/react-ui';
import { Alert, Confirmation } from '..';
import { useMst } from '../../models/Root';

type MainLayoutProps = {
  children: ReactNode;
  roles: string[];
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, roles }) => {
  const cssClasses = useStyles();
  const { user } = useMst();

  useEffect(() => {
    user.init(roles);
  }, []);

  if (!user.init) {
    <LoadingIndicator />;
  }

  return (
    <>
      <Alert />
      <Confirmation />
      <div className={cssClasses.container}>
        <div className={cssClasses.routesWrapper}>{children}</div>
      </div>
    </>
  );
};

export default observer(MainLayout);
