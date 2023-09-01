import React from 'react';
import { observer } from 'mobx-react-lite';
import { MultiselectDropdownSearch } from 'components';
import { PlanFilterNames, ReassignmentFilterValues, useMst } from 'models';
import PlanFiltersReassignment from './PlanFiltersReassignment';
import PlanFiltersEdit from './PlanFiltersEdit';

const PlanFilters = () => {
  const {
    header: { displayReassignment, filters },
    stage,
    table: { type },
  } = useMst().plan;

  const third_width = '19vw';

  if (type === 'segment') {
    return null;
  }

  if (type === 'branch') {
    return (
      <div>
        <MultiselectDropdownSearch
          labelWidth={third_width}
          filterModel={filters.get(PlanFilterNames.gkm)!}
        />
      </div>
    );
  }

  if (
    filters.get(PlanFilterNames.reassignment)?.selectedItem ===
    ReassignmentFilterValues.reassignment
  ) {
    return <PlanFiltersReassignment />;
  }

  return <PlanFiltersEdit />;
};

export default observer(PlanFilters);
