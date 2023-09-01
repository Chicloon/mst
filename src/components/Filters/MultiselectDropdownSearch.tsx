import React, { useEffect, useRef, useState } from 'react';
import {
  LoadingIndicator,
  Typography,
  PcapTheme,
  DropdownList,
  DropdownSearch,
  Hint,
} from '@pcapcc360/react-ui';
import { DropdownSearchSelectedValue } from '@pcapcc360/react-ui/build/components/dropdown_search/types';
import { observer } from 'mobx-react-lite';
import { FilterProps } from './types';
import { makeStyles } from '@material-ui/core';
import { getSnapshot } from 'mobx-state-tree';
import { LoadStatuses } from 'models';

const useStyles = makeStyles<PcapTheme, Partial<{ isMultiSelect: boolean }>>((theme) => ({
  dropDown: {
    position: 'absolute',
    // zIndex: 5,
  },
  containerClass: ({ isMultiSelect }) => {
    if (!isMultiSelect) {
      return {
        '& div[tabindex="-1"]': {
          marginBottom: '.5rem',
        },
      };
    }
    return {};
  },
}));

const Filter: React.FC<FilterProps> = ({
  filterModel: filterModel,
  listClass,
  labelWidth,
}: FilterProps) => {
  if (!filterModel) {
    return null;
  }

  const {
    label,
    items,
    setFilter,
    selectedItem,
    isInit,
    multiSelected,
    setSelected,
    state,
    isMultiSelect,
    allowClearAll,
    isEnabled,
  } = filterModel;

  const classes = useStyles({ isMultiSelect });
  const [open, setOpen] = useState(false);
  if (selectedItem === null) {
    return null;
  }
  if (!isInit) {
    return <LoadingIndicator />;
  }

  const data: DropdownSearchSelectedValue[] = [...items.entries()].map((el) => ({
    value: el[1] as string,
    label: el[0] as string,
    type: isMultiSelect ? 'checkbox' : 'default',
    disabled: false,
  }));

  const onChange = (e: DropdownSearchSelectedValue[] | DropdownSearchSelectedValue) => {
    if (Array.isArray(e)) {
      setFilter(e.map((el) => el.label));
    } else {
      setFilter(e.label);
    }
  };

  const onDeleteChip = (e: DropdownSearchSelectedValue) => {
    const newSelected = multiSelected.filter((el) => e.label !== el);
    setFilter((newSelected as [string]) || []);
  };

  const onRemoveAllSelectedValue = () => {
    if (isMultiSelect) {
      setFilter([]);
    } else {
      setFilter('');
    }
  };

  const selected = isMultiSelect
    ? multiSelected.map((el) => ({
        label: el,
        value: items.get(el as string),
        type: 'checkbox',
        disabled: false,
      }))
    : {
        label: selectedItem,
        value: selectedItem,
        // type: 'checkbox',
        // disabled: false,
      };

  const loadOptions = (
    value: string,
    cb: (data: DropdownSearchSelectedValue[]) => void
  ) => {
    let newData = data.slice(0, 20);

    const filteredData = data.filter((el) => multiSelected.includes(el.label));
    if (value.length > 0) {
      newData = data
        .filter((el) => el.label.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 20);
    } else if (filteredData.length > 0) {
      const notIncludedData = data.filter(
        (d) => !filteredData.some((fd) => fd.value === d.value)
      );
      newData =
        filteredData.length > 5
          ? filteredData
          : [...filteredData, ...notIncludedData.slice(0, 8)];
    }

    cb(newData);
  };

  const hintMessage =
    multiSelected.length > 0 ? (
      <div>
        Выбраны {label}:
        {getSnapshot(multiSelected).map((el, idx) => (
          <p key={label + idx}> {el}</p>
        ))}
      </div>
    ) : (
      ''
    );

  return (
    <div>
      <Hint title={hintMessage}>
        <Typography
          variant="body2"
          style={{
            height: '1rem',
            width: `calc(${labelWidth} + 1rem`,
            marginBottom: '5px',
            cursor: 'pointer',
          }}
        >
          {label}
        </Typography>
      </Hint>
      <div
        style={{ width: labelWidth, zIndex: open ? 5 : 1 }}
        className={classes.dropDown}
        onClick={() => {
          setOpen(true);
        }}
      >
        <DropdownSearch
          containerClass={classes.containerClass}
          onRemoveAllSelectedValue={onRemoveAllSelectedValue}
          onDeleteChip={onDeleteChip}
          data={data.slice(0, 10)}
          selectedValue={selected}
          // // onChange={setSelected}
          loadOptions={loadOptions}
          // isListItemOpen={false}
          onChange={onChange}
          multiple={isMultiSelect ? true : undefined}
          onClose={() => {
            setOpen(false);
          }}
          disabled={state === LoadStatuses.pending || isEnabled === false}
        />
      </div>
    </div>
  );
};

export default observer(Filter);
