import React, { useState, useRef, useEffect } from 'react';
import useStyles from './styles';
import { observer } from 'mobx-react-lite';
import { Hint, PcapTheme, TextField, icons } from '@pcapcc360/react-ui';
import { useTheme, Grow } from '@material-ui/core';
import { breakNumberIntoGroups, getUuid } from 'utils/functions';
import { EditCellModelInstance } from './EditCellModel';
import { Cell } from 'react-table';

type EditCellProps = {
  onClick?: () => void;
  model: EditCellModelInstance;
  cell: Cell<{ id: string }>;
  isValid?: (input: string) => { fail: boolean; message: string }[];
};

const EditCell: React.FC<EditCellProps> = ({ model, cell, isValid }) => {
  const classes = useStyles({});
  const inputRef = useRef(null);
  const { prevValues, setPrevValue, nowEditing, setNowEditing, setEditedCell } = model;
  const theme = useTheme<PcapTheme>();
  const { column, row, value } = cell;
  const uuid = getUuid({ id: column.id, rowIdx: row.index });
  const dataId = row.original.id;
  const prevValue = prevValues.get(dataId)?.get(column.id) as string;
  const [inputValue, setInputValue] = useState<string | null>(value);
  const [error, setError] = useState<string | null>(null);

  const displayValue = inputValue ? breakNumberIntoGroups(inputValue) : null;
  setPrevValue(dataId, column.id, value);

  const onInputChange = (event: React.ChangeEvent<{ value: string }>) => {
    const {
      target: { value },
    } = event;

    if (value === '') {
      setInputValue('');
      return;
    }

    let floatValue = parseFloat(value.replace(',', '.')) as string | number;

    floatValue = Number.isNaN(floatValue) ? '' : floatValue;

    if (value.slice(-1) === '0') {
      setInputValue(value);
      return;
    }
    const newInputValue = value
      ? `${floatValue.toString()}${value.slice(-1) === ',' ? ',' : ''}`.replace('.', ',')
      : null;
    setInputValue(newInputValue);
    setEditedCell(dataId, column.id, newInputValue);
    if (isValid) {
      const validation = isValid(value);
      const failedValidation = validation.find((el) => el.fail);
      if (failedValidation) {
        setError(failedValidation.message);
      } else {
        setError(null);
      }
    }
  };

  const onCellClick = () => {
    setNowEditing(uuid);
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key == 'Escape') {
      if (e.key === 'Enter') {
        const cellValue = String(inputValue).replace(',', '.') || null;
        setEditedCell(dataId, column.id, cellValue);
      }

      if (e.key === 'Escape') {
        setInputValue(null);
      }

      setNowEditing('');
    }
  };

  const className = `${classes.editCell}`;

  const editField = (
    <Grow in={true}>
      <div className={`${classes.inputWrapper} ${error ? classes.inputWrapperError : ''} `}>
        <TextField value={inputValue} onChange={onInputChange} onKeyDown={onKeyDown} ref={inputRef} autoFocus />
        {error && (
          <div className={classes.inputIcon} style={{ left: '-24px', top: '-24px' }}>
            <Hint title={error}>
              <icons.line.CircleInfo color={theme.pcapPalette.error.main} />
            </Hint>
          </div>
        )}

        <div
          className={classes.inputIcon}
          onClick={() => {
            setNowEditing('');
            setInputValue(prevValue);
          }}
        >
          <icons.line.ArrowsRepeat />
        </div>
        <div
          className={classes.inputIcon}
          style={{ top: `-${theme.spacing(2.5)}px`, right: `-${theme.spacing(2.5)}px` }}
          onClick={() => {
            setNowEditing('');
          }}
        >
          <icons.fill.CircleXmark color={theme.pcapPalette.info.main} />
        </div>
      </div>
    </Grow>
  );

  const color =
    prevValue !== inputValue
      ? error
        ? theme.pcapPalette.error.main
        : theme.pcapPalette.success.main
      : theme.pcapPalette.text.primary;

  return (
    <div className={className} style={{ position: 'relative', cursor: 'pointer' }}>
      {uuid === nowEditing ? (
        editField
      ) : (
        <div
          style={{
            position: 'relative',
            color,
            display: 'flex',
            justifyContent: 'center',
          }}
          className={classes.editCell}
          onClick={onCellClick}
        >
          {displayValue || '-'}
        </div>
      )}
    </div>
  );
};

export default observer(EditCell);
