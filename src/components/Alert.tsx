import React from 'react';
import { observer } from 'mobx-react-lite';
import { Slide } from '@material-ui/core';
import { Alert as OneKibAlert } from '@pcapcc360/react-ui';

import { useMst } from '../models/Root';

const Alert = () => {
  const {
    ui: { alert },
  } = useMst();

  return (
    <Slide in={alert.show} direction="left" mountOnEnter unmountOnExit>
      <OneKibAlert
        type={alert.type}
        isStaticAlert
        fixed
        placement="top-right"
        onClose={() => alert.hideAlert()}
        title={alert.title}
      >
        {alert.message}
      </OneKibAlert>
    </Slide>
  );
};

export default observer(Alert);
