import React from 'react';
import { PcapTheme, Toggle } from '@pcapcc360/react-ui';
import { makeStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  toggle: {
    margin: `0 ${theme.spacing(0.5)}px`,
  },
}));

const ToggleFiler: React.FC<FilterProps> = ({ filterModel }: FilterProps) => {
  const cssClasses = useStyles();

  if (!filterModel) {
    return null;
  }
  const { items, selectedItem, setFilter } = filterModel;
  const filterValues = items.keys();
  const firstValue = filterValues.next().value;
  const secondValue = filterValues.next().value;

  const toggleChange = () => {
    setFilter(selectedItem === firstValue ? secondValue : firstValue);
  };

  return (
    <div className={cssClasses.wrapper} onClick={toggleChange}>
      <Typography variant="body2">{firstValue}</Typography>
      <Toggle className={cssClasses.toggle} checked={selectedItem !== firstValue} />
      <Typography variant="body2">{secondValue}</Typography>
    </div>
  );
};

export default observer(ToggleFiler);
