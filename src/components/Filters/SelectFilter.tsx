import React, { useRef, useState, useEffect, useMemo } from 'react';
import { NewSelect, LoadingIndicator, PcapTheme } from '@pcapcc360/react-ui';
import { OptionTypeBase, Props } from 'react-select';
import { observer } from 'mobx-react-lite';
import { FilterProps, NewSelectItem } from './types';
import { makeStyles } from '@material-ui/core';

const MAX_DATA_LENGTH = 150;

const useStyles = makeStyles<PcapTheme>((theme: PcapTheme) => ({
  wrapper: {
    width: '100%',
    '& > div': {
      width: 'inherit',
      '& > div': {
        height: '2rem',
        '& div.select__menu-portal': {
          zIndex: 5,
        },
      },
    },
  },
  label: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
    '& > p': {
      textAlign: 'end',
      width: '100%',
    },
  },
  labelFromModal: {
    width: '20%',
    '& > p': {
      textAlign: 'start',
    },
  },
  wrapperFromModal: {
    marginBottom: '.5rem',
  },
  dropDown: {
    width: '65%',
    flexGrow: 1,
    '& ul:first-child': {
      color: 'red',
    },
  },
  uploadBPlanDropdown: {
    width: '300px',
    flexGrow: 'inherit',
  },
  showCountDropdown: {
    width: 'auto',
    flexGrow: 'inherit',
  },
  classNameLabel: {
    marginBottom: 'unset',
  },
}));

const SelectFilter: React.FC<FilterProps & { selectedOnTop?: boolean }> = ({
  filterModel: filterModel,
  wrapperClass,
  placeholder,
  selectedOnTop = false,
  ...rest
}: FilterProps) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const buttons = wrapperRef?.current?.children[0]?.children[1]?.children[1]?.children[1];
  const closeButton = buttons && buttons.children[0];

  useEffect(() => {
    const onClick = () => {
      filterModel?.setFilter('');
    };

    if (closeButton && !isMultiSelect && rest.isClearable) {
      closeButton.addEventListener('click', onClick);
    }
    return () => {
      closeButton && closeButton.removeEventListener('click', onClick);
    };
  }, [closeButton]);

  if (!filterModel) {
    console.warn('no model for filter component');
    return null;
  }

  const {
    label,
    items,
    setFilter,
    selectedItem,
    isInit,
    isDisabled,
    isMultiSelect,
    multiSelected,
    idOfSelected,
    filterOptions,
  } = filterModel;

  if (!isInit) {
    return <LoadingIndicator />;
  }

  const options = filterOptions(selectedOnTop);

  const onChange = (val: OptionTypeBase | null) => {
    if (!val) {
      return;
    }
    if (isMultiSelect) {
      setFilter(val.map((el: { label: string }) => el.label));
    } else {
      setFilter(val.label);
    }
  };

  const value = isMultiSelect
    ? multiSelected.map((el) => ({ label: el, value: items.get(el) }))
    : { value: idOfSelected, label: selectedItem };

  const onDeleteChip = (removableValue: NewSelectItem) => {
    const newSelected = multiSelected.filter((el) => el !== removableValue.label);
    setFilter(newSelected);
  };

  const onInputChange = (input: string) => {
    const res = options.filter((el) =>
      el.label.toLowerCase().includes(input.toLowerCase())
    );

    setSearchResults(res.slice(0, MAX_DATA_LENGTH));
    setInputValue(input);
  };

  return (
    <div className={`${wrapperClass} ${classes.wrapper}`} ref={wrapperRef}>
      <NewSelect
        {...rest}
        value={value}
        helperText=""
        classNameLabel={classes.classNameLabel}
        isDisabled={isDisabled}
        isMulti={isMultiSelect}
        label={label}
        options={
          searchResults.length === 0 ? options.slice(0, MAX_DATA_LENGTH) : searchResults
        }
        onDeleteChip={onDeleteChip}
        inputValue={inputValue}
        onInputChange={onInputChange}
        placeholder={placeholder || ''}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
};

export default observer(SelectFilter);
