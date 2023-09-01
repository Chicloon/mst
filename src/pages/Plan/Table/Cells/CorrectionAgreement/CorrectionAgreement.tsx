import { CheckboxFilter, Filter } from 'components';
import { observer } from 'mobx-react-lite';
import { onSnapshot } from 'mobx-state-tree';
import { PlanItemInstance, useMst } from 'models';
import React from 'react';
import { adminRoles } from 'utils/constants';
import { CorrectionAgreementModel } from './CorrectionAgreementModel';
import { CorrectionFilterNames } from './enum';

const CorrectionAgreement: React.FC<{ data: PlanItemInstance }> = ({ data }) => {
  const {
    user,
    plan: { stage },
  } = useMst();
  const model = CorrectionAgreementModel.create();
  model.init(data);

  let showForKMs = false;
  if (stage?.state === 'CORR_BM') {
  }

  if (stage?.state === 'CORR_KM') {
    showForKMs = true;
  }

  const { rkm, gkm } = CorrectionFilterNames;

  return (
    <div style={{ marginTop: '8px' }}>
      <CheckboxFilter filterModel={model.filters.get(rkm)!} />
      <CheckboxFilter filterModel={model.filters.get(gkm)!} />
    </div>
  );
};

export default observer(CorrectionAgreement);
