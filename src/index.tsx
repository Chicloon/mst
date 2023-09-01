import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';
import App from './app/App';

// import lodash from 'lodash';
// import dayjs from 'dayjs';

// window.lodash = lodash;
// window.dayjs = dayjs;

const Render: FC = () => (
  <AppWrapper>
    <App />
  </AppWrapper>
);

ReactDOM.render(<Render />, document.getElementById('root'));
