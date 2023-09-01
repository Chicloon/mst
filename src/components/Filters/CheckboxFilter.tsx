import React from 'react';
import { FormControlLabel, Typography, PcapTheme, Checkbox } from '@pcapcc360/react-ui';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: PcapTheme) => ({
  wrapper: {
    display: 'flex',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '10rem',
    marginRight: theme.spacing(2),
  },
  filtersWrapper: {
    width: '100%',
    display: 'flex',
  },
  checkBoxWrapper: {
    // minWidth: '10rem',
  },
}));

const CheckboxFilter: React.FC<FilterProps> = ({ filterModel, disabled }) => {
  const classes = useStyles();
  if (!filterModel) {
    return null;
  }

  const { selectedItem, label, items, setFilter, isInit, multiSelected, isEnabled } =
    filterModel;

  const onClick = () => {
    setFilter(selectedItem === 'on' ? 'off' : 'on');
  };

  return (
    <div className={classes.checkBoxWrapper}>
      <FormControlLabel
        color="default"
        control={
          <Checkbox
            onClick={() => onClick()}
            checked={selectedItem == 'on'}
            disabled={isEnabled === false}
          />
        }
        label={label}
      />
    </div>
  );
};

export default observer(CheckboxFilter);
