import React from 'react';
import { Typography, PcapTheme, Checkbox } from '@pcapcc360/react-ui';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';
import { FormControlLabel, makeStyles } from '@material-ui/core';

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
    flexDirection: 'column',
  },
  checkBoxWrapper: {
    minWidth: '10rem',
  },
}));

const MultiSelectCheckbox: React.FC<FilterProps> = ({ filterModel, disabled }) => {
  const classes = useStyles();
  if (!filterModel) {
    return null;
  }

  const { label, items, setFilter, isInit, multiSelected, isEnabled } = filterModel;

  const onClick = (item: string) => {
    setFilter(item);
  };

  const filters = [...items.keys()].map((item) => (
    <div className={classes.checkBoxWrapper} key={`mulityfilter-${item}`}>
      <FormControlLabel
        color="default"
        control={
          <Checkbox
            onClick={() => onClick(item)}
            checked={multiSelected.includes(item)}
            disabled={disabled?.includes(item) || isEnabled === false}
          />
        }
        label={item}
      />
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      {/* <div className={classes.label}> */}
      {/* <Typography variant="body1">{label}</Typography> */}
      {/* </div> */}
      <div className={classes.filtersWrapper}>{filters}</div>
    </div>
  );
};

export default observer(MultiSelectCheckbox);
