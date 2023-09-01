import React, { FC } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru';
dayjs.extend(customParseFormat);
dayjs.locale('ru');
import { Provider, rootStore } from 'models/Root';
import Routes from './Routes';
import { makeStyles } from '@material-ui/styles';
import { Auth } from 'utils/types';
import { Alert, Confirmation } from 'components';
// import { Alerts } from 'components/Alerts';
import 'react-virtualized/styles.css';

const useStyles = makeStyles(() => ({
  contentWrapper: {
    // overflow: 'hidden',
    height: 'calc(100vh - 185px)',
    maxHeight: 'calc(100vh - 118px)',
  },
}));

const App: FC<{ auth?: Auth }> = (props) => {
  const c = useStyles();
  console.log('--- props', props);
  const { auth } = props;

  if (auth) {
    rootStore.auth.setData(auth);
    rootStore.user.init(auth.roles.map((role) => role.id));
  }

  return (
    <div className={c.contentWrapper}>
      <Provider value={rootStore}>
        {/* <Alerts /> */}
        <Alert />
        <Confirmation />
        <Routes />
      </Provider>
    </div>
  );
};

export default App;
