import React from 'react';
import { observer } from 'mobx-react-lite';
import { PlanFilterNames, PlanItemInstance, useMst } from 'models';
import { adminRoles } from 'utils/constants';
import { CheckboxFilter, ToggleFilter } from 'components';
import useStyles from './styles';

const PlanActionFilters = () => {
  const {
    header: { displayReassignment, filters, reassignmentOrgs, uniqOrgIds },
    table: { type, items },
    stage,
  } = useMst().plan;
  const { user } = useMst();

  const classes = useStyles();

  const isTwoOrgs = uniqOrgIds.every((el: number) =>
    items.some((item: PlanItemInstance) => {
      return +item.id_org! === el;
    })
  );

  const showReassignment =
    type === 'inn' &&
    displayReassignment &&
    reassignmentOrgs &&
    isTwoOrgs &&
    (user.roleExistsAny(adminRoles) ||
      (user.roleExistsAny(['kib_skm_pln_rkm']) &&
        ['TRANSF_PLAN_PERETOK', 'TRANSF_PLAN'].includes(stage!.state as string)));

  return (
    <div>
      <div className={classes.planActionsFiltersWrapper}>
        {showReassignment && (
          <div>
            <ToggleFilter filterModel={filters.get(PlanFilterNames.reassignment)!} />
          </div>
        )}
        <CheckboxFilter filterModel={filters.get(PlanFilterNames.showEmpty)!} />
      </div>
    </div>
  );
};

export default observer(PlanActionFilters);
