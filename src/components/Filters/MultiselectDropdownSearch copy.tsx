import React, { useState } from 'react';
import {
  LoadingIndicator,
  Typography,
  PcapTheme,
  DropdownSearch,
} from '@pcapcc360/react-ui';
import { DropdownSearchSelectedValue } from '@pcapcc360/react-ui/build/components/dropdown_search/types';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  dropDown: {
    position: 'absolute',
    zIndex: 5,
  },
}));

const Filter: React.FC<FilterProps> = ({
  filterModel: filterModel,
  listClass,
  labelWidth,
}: FilterProps) => {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);

  if (!filterModel) {
    return null;
  }

  const { label, items, setFilter, selectedItem, isInit } = filterModel;

  if (selectedItem === null) {
    return null;
  }
  if (!isInit) {
    return <LoadingIndicator />;
  }

  const data: DropdownSearchSelectedValue[] = [...items.entries()].map((el) => ({
    value: el[1] as string,
    label: el[0] as string,
    type: 'checkbox',
    disabled: false,
  }));

  return (
    <div>
      <Typography variant="body2" style={{ height: '1rem', width: '22rem' }}>
        {label}
      </Typography>
      <div style={{ width: labelWidth }} className={classes.dropDown}>
        <DropdownSearch
          onRemoveAllSelectedValue={() => setSelected([])}
          data={data}
          selectedValue={selected}
          onChange={setSelected}
          multiple
        />
      </div>
    </div>
  );
};

export default observer(Filter);
