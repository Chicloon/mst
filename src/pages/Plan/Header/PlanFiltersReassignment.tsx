import React from 'react';
import { observer } from 'mobx-react-lite';
import { CheckboxFilter, MultiselectDropdownSearch } from 'components';
import { PlanFilterNames, useMst } from 'models';
import useStyles from './styles';
import { PlanTypes } from 'models/Admin';
import { Typography, Hint } from '@pcapcc360/react-ui';
import { getSnapshot } from 'mobx-state-tree';
import { uniqBy } from 'lodash';

const PlanFiltersReassignment = () => {
  const {
    header: { filters, uniqOrgIds, reassignmentOrgs },
    table: { items },
    stage,
  } = useMst().plan;
  const classes = useStyles();

  const { factPrognosis, article1, article2, article3, tb, fact, xoGkmBranch } =
    PlanFilterNames;

  const third_width = '19vw';
  return (
    <div>
      <div className={classes.filterRowWrapper}>
        <div style={{ minWidth: `calc(${third_width} + 1rem)` }}>
          <Typography variant="body1semibold"> ТБ</Typography>
          <Typography variant="body1">{filters.get(tb)?.multiSelected[0]}</Typography>
        </div>
        <div style={{ minWidth: `calc(${third_width} + 1rem)` }}>
          <Typography variant="body2semibold"> Организации</Typography>
          {reassignmentOrgs &&
            reassignmentOrgs.map((item) => {
              const shortName = items.find((el) => {
                return el.id_org_name === item.name;
              })?.id_org_code;
              return (
                <div key={`orgTitle-${item.inn}`}>
                  {/* @ts-ignore: next-line */}
                  <Hint title={item.name}>
                    <Typography variant="body2">
                      <b>{item.inn}</b>, {shortName}
                    </Typography>
                  </Hint>
                </div>
              );
            })}
        </div>

        <div>
          <div className={classes.filterRowWrapper}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
              <CheckboxFilter filterModel={filters.get(fact)!} />
              {stage?.type !== PlanTypes.ANNUAL && (
                <CheckboxFilter filterModel={filters.get(factPrognosis)!} />
              )}
              <CheckboxFilter filterModel={filters.get(xoGkmBranch)!} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}></div>
          </div>
        </div>
      </div>

      <div className={classes.filterRowWrapper}>
        <MultiselectDropdownSearch
          labelWidth={third_width}
          filterModel={filters.get(article1)!}
        />
        <MultiselectDropdownSearch
          labelWidth={third_width}
          filterModel={filters.get(article2)!}
        />
        <MultiselectDropdownSearch
          labelWidth={third_width}
          filterModel={filters.get(article3)!}
        />
      </div>
    </div>
  );
};

export default observer(PlanFiltersReassignment);
