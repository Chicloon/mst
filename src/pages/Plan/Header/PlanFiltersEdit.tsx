import React from 'react';
import { observer } from 'mobx-react-lite';
import { CheckboxFilter, SelectFilter } from 'components';
import { PlanFilterNames, useMst } from 'models';
import useStyles from './styles';
import { PlanTypes } from 'models/Admin';
import { Typography } from '@pcapcc360/react-ui';

const PlanFiltersEdit = () => {
  const {
    header: { filters, expanded, articleFilterApplied, showTotal },
    stage,
  } = useMst().plan;
  const classes = useStyles();

  const {
    tb,
    name,
    name_negative,
    inn,
    inn_negative,
    factPrognosis,
    vko,
    gkm,
    article1,
    article2,
    article3,
    sortByArticle,
    sortByColumn,
    sortDirection,
    fact,
    xoGkmBranch,
    XO,
    SOGL,
  } = PlanFilterNames;

  const filtersCount = articleFilterApplied ? (
    <Typography variant="body1semibold"> Применен фильтр по статьям</Typography>
  ) : null;

  const restFilters = (
    <div
      className={classes.restFiltersWrapper}
      style={{
        opacity: expanded ? 1 : 0,
        display: expanded ? 'block' : 'none',
      }}
    >
      <div className={classes.filterRowWrapper}>
        <SelectFilter filterModel={filters.get(article1)!} />
        <SelectFilter filterModel={filters.get(article2)!} />
        <SelectFilter filterModel={filters.get(article3)!} />
      </div>
      <div className={classes.filterRowWrapper}>
        <SelectFilter filterModel={filters.get(sortByArticle)!} isClearable />
        <SelectFilter filterModel={filters.get(sortByColumn)!} isClearable />
        <SelectFilter filterModel={filters.get(sortDirection)!} isSearchable={false} />
      </div>
    </div>
  );

  return (
    <div>
      <div className={classes.filterRowWrapper}>
        <SelectFilter wrapperClass={classes.tbWrapper} filterModel={filters.get(tb)!} />
        <SelectFilter
          wrapperClass={classes.vkoWrapper}
          filterModel={filters.get(vko)!}
          selectedOnTop
        />

        <div className={classes.filterRowWrapper}>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <CheckboxFilter filterModel={filters.get(fact)!} />
            {stage?.type !== PlanTypes.ANNUAL && (
              <CheckboxFilter filterModel={filters.get(factPrognosis)!} />
            )}
            <CheckboxFilter filterModel={filters.get(xoGkmBranch)!} />

            {true && (
              <div>
                <CheckboxFilter filterModel={filters.get(PlanFilterNames.showTotal)!} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={classes.filterRowWrapper}>
        <SelectFilter filterModel={filters.get(name)!} selectedOnTop />
        <SelectFilter filterModel={filters.get(name_negative)!} selectedOnTop />
        <SelectFilter filterModel={filters.get(gkm)!} />
      </div>
      <div className={classes.filterRowWrapper}>
        <SelectFilter filterModel={filters.get(inn)!} selectedOnTop />
        <SelectFilter filterModel={filters.get(inn_negative)!} selectedOnTop />
        <SelectFilter filterModel={filters.get(SOGL)!} />
      </div>
      {expanded ? restFilters : filtersCount}
    </div>
  );
};

export default observer(PlanFiltersEdit);
