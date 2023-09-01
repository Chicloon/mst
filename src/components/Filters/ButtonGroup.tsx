import React, { ReactNode } from 'react';
import {
  LoadingIndicator,
  Typography,
  PcapTheme,
  DropdownList,
  ButtonGroup,
} from '@pcapcc360/react-ui';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  label: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
    '& > p': {
      width: '100%',
    },
  },
  dropDown: {
    width: '65%',
    flexGrow: 1,
    '& ul:first-child': {
      color: 'red',
    },
    '& button': {
      minWidth: '200px',
    },
  },
}));

const ButtonGroupFilter: React.FC<FilterProps> = ({
  filterModel: filterModel,
  listClass,
  labelWidth,
}: FilterProps) => {
  const classes = useStyles();
  if (!filterModel) {
    return null;
  }

  const { name, label, items, setFilter, selectedItem, isInit, shortNames } = filterModel;
  const dataList = [...items.keys()].map((item) => ({
    value: item,
  }));
  let selectedIndex;
  [...items.keys()].forEach((item, index) => {
    if (item == selectedItem) {
      selectedIndex = index;
    }
  });
  if (selectedItem === null) {
    return null;
  }
  if (!isInit) {
    return <LoadingIndicator />;
  }

  const onChange = (
    e:
      | React.ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>
      | undefined
  ) => {
    if (e && e.target && e.target.value) {
      const selectedKey = e.target.value as string;
      setFilter(selectedKey);
    }
  };

  const setSelectedIndex = (item: number) => {
    setFilter([...items.keys()][item]);
  };

  return (
    <div className={classes.wrapper}>
      <div style={{ width: labelWidth ? labelWidth : '' }} className={classes.label}>
        <Typography variant="body2">{label}</Typography>
      </div>
      <div className={classes.dropDown}>
        <ButtonGroup
          dataList={dataList}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          groupAriaLabel="CopyStage"
        />
      </div>
    </div>
  );
};

export default observer(ButtonGroupFilter);
