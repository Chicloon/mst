import React, { useState, useRef, useMemo } from 'react';
import useStyles from '../styles';
import { PlanFilterNames, PlanItemInstance, ReassignmentFilterValues, useMst } from 'models';
import { observer } from 'mobx-react-lite';
import { PcapTheme, TextField, icons } from '@pcapcc360/react-ui';
import { useTheme, Grow } from '@material-ui/core';
import { breakNumberIntoGroups, getUuid } from 'utils/functions';
import { CellProps } from './types';
import { adminRoles } from 'utils/constants';

const PlanDataCell: React.FC<CellProps<PlanItemInstance>> = ({
  data,
  accessor,
  // rowIdx,
  width,
}) => {
  const cellValue = data[accessor as keyof PlanItemInstance];

  const {
    plan: {
      table: { setEditedCell, nowEditing, setNowEditing, editedCells, removeFromEditedCell, reassignCell, fontSize },
      header: { filters },
      header,
    },
  } = useMst();
  const { ui, user } = useMst();
  // const classes = useStyles({ cellHeight });
  const inputRef = useRef(null);
  const theme = useTheme<PcapTheme>();

  const styles = {
    borderWrapper: {
      boxShadow: `0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
    },

    editCell: {
      cursor: 'context-menu',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      padding: `0 ${theme.spacing(0.5)}px`,
    },

    inputWrapper: {
      position: 'absolute',
      zIndex: 100,
      width: '12rem',
      boxShadow: '0 0 8px 0px',
      borderRadius: '4px',
    },
    inputIcon: {
      position: 'absolute',
      top: 6,
      right: 3,
      cursor: 'pointer',

      '& svg': {
        fill: theme.pcapPalette.text.primary,
      },
      '& svg:hover': {
        fill: theme.pcapPalette.text.secondary,
      },
    },
  } as { [key: string]: React.CSSProperties };
  const colors = theme.pcapPalette.complimentary.map((el) => [el.main, el.secondary]).flat();

  const rowId = data.id!.toString();
  const uuid = getUuid({ rowIdx: +rowId, id: accessor as string });
  const columnId = accessor as string;
  const cellColor = data.b_article_lvl3_color_row ? data.n_article_lvl3_color : null;

  const [inputValue, setInputValue] = useState<string | null>(null);
  const value = editedCells.get(rowId)?.get(columnId) || cellValue;

  const onChange = (event: React.ChangeEvent<{ value: string }>) => {
    const {
      target: { value },
    } = event;

    if (value.length > 20) {
      return;
    }

    if (value === '') {
      setInputValue('');
      return;
    }

    let floatValue = value.length > 1 ? parseFloat(value.replace(',', '.')) : value;

    floatValue = Number.isNaN(floatValue) ? '' : floatValue;

    if (value.slice(-1) === '0') {
      setInputValue(value);
      return;
    }

    setInputValue(value ? `${floatValue.toString()}${value.slice(-1) === ',' ? ',' : ''}`.replace('.', ',') : null);
  };

  const onClick = () => {
    setNowEditing(uuid);
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key == 'Escape') {
      if (e.key === 'Enter') {
        const cellValue = inputValue?.replace(',', '.') || null;
        if (filters.get(PlanFilterNames.reassignment)?.selectedItem === ReassignmentFilterValues.reassignment) {
          ui.confirmation.setConfirmation({
            title: 'Осуществить переброску?',
            onConfirm: () => {
              reassignCell(data, columnId, cellValue);
            },
          });
        } else {
          setEditedCell(rowId.toString(), columnId, cellValue);
        }
      }

      if (e.key === 'Escape') {
        setInputValue(null);
      }

      setNowEditing('');
    }
  };

  const color = cellValue === value ? 'inherit' : theme.pcapPalette.success.main;
  const background = cellColor ? colors[cellColor - 1] : 'inherit';
  const displayValue = breakNumberIntoGroups(value);

  const isEditableCell =
    (columnId.includes('plan_tb') && data.b_rw_tb === 1) ||
    (columnId.includes('plan_ca') &&
      data.b_rw_ca === 1 &&
      user.roleExistsAny(['bad_all_pln_cen', 'bad_skm_pln_cen', 'kib_skm_pln_gkm', 'kib_all_pln_cen']));

  const editField = (
    <Grow in={true}>
      <div
        style={{ ...styles.inputWrapper, color, fontSize }}
        //  className={classes.inputWrapper}
      >
        {/* @ts-ignore: next-line */}
        <TextField
          value={inputValue === null ? value?.toString().replace('.', ',') || '' : inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
          autoFocus
        />

        <div
          // className={classes.inputIcon}
          style={styles.inputIcon}
          onClick={() => {
            removeFromEditedCell(rowId, columnId);
          }}
        >
          <icons.line.ArrowsRepeat />
        </div>
        <div
          // className={classes.inputIcon}
          style={{
            ...styles.inputIcon,
            top: `-${theme.spacing(2.5)}px`,
            right: `-${theme.spacing(2.5)}px`,
          }}
          onClick={() => {
            setInputValue(null);
            setNowEditing('');
          }}
        >
          <icons.fill.CircleXmark color={theme.pcapPalette.error.main} />
        </div>
      </div>
    </Grow>
  );

  if (isEditableCell) {
    return (
      <div
        // className={className}
        style={{
          ...styles.borderWrapper,
          ...styles.editCell,
          position: 'relative',
          background,
          cursor: 'pointer',
          fontSize,
        }}
      >
        {uuid === nowEditing ? (
          editField
        ) : (
          <div
            style={{ ...styles.editCell, color, position: 'relative' }}
            // className={classes.editCell}
            onClick={onClick}
          >
            {displayValue}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.borderWrapper,
        ...styles.editCell,
        color,
        background,
        minWidth: width,
        cursor: 'default',
        fontSize,
      }}
      // className={className}
    >
      {displayValue}
    </div>
  );
};

export default observer(PlanDataCell);
