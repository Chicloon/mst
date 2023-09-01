import { observer } from 'mobx-react-lite';
import { LoadStatuses, PlanFilterNames, useMst } from 'models';
import { Button, Hint, IconButton, icons } from '@pcapcc360/react-ui';
import React from 'react';
import useStyles from './styles';
import { SelectFilter } from 'components';

function PlanFilterControls() {
  const {
    header: { applyFilters, expanded, setExpanded, filters, filtersApplied, editMode },
    table: { state, type },
  } = useMst().plan;
  const classes = useStyles();

  const scaleFilter = filters.get(PlanFilterNames.scale);
  const onClick = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  return (
    <div className={classes.expandButtonWrapper}>
      <div>
        {/* @ts-ignore: next line  */}
        <Hint title={filtersApplied ? 'Выберете фильтры' : 'Применить выбранные фильтры'}>
          <Button
            variant="contained"
            onClick={applyFilters}
            disabled={state === LoadStatuses.pending || filtersApplied}
          >
            Применить
          </Button>
        </Hint>
      </div>
      {type === 'inn' && editMode && (
        <div className={classes.bottomActionsWrapper}>
          {scaleFilter && (
            <SelectFilter
              wrapperClass={classes.scaleWrapper}
              filterModel={scaleFilter}
              isSearchable={false}
            />
          )}
          {/* @ts-ignore: next line  */}
          <Hint title={expanded ? 'Скрыть лишнее' : 'Показать все фильтры'}>
            <IconButton variant="outlined" onClick={onClick}>
              <icons.line.FilterList />
            </IconButton>
          </Hint>
        </div>
      )}
    </div>
  );
}

export default observer(PlanFilterControls);
