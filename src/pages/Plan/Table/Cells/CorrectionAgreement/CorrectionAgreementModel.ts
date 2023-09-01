import { flow, getSnapshot, Instance, types as t } from 'mobx-state-tree';
import {
  apiActions,
  CheckboxFilterValues,
  Filter,
  FilterInstance,
  PlanItemInstance,
  rootStore,
} from 'models';
import { adminRoles } from 'utils/constants';
import { CorrectionStages, CorrectionFilterNames } from './enum';

export const CorrectionAgreementModel = t
  .model('CorrectionAgreement', {
    stageId: 0,
    orgId: 0,
    tbId: 0,
    isInit: false,
    name: '',
    prevStatus: t.map(t.string),
    filters: t.map(Filter),
  })
  .actions((self) => {
    return {
      onFilterChange(label: string) {
        rootStore.ui.confirmation.setConfirmation({
          title: `Изменить статус корректировки для организации ${self.name}?`,
          onConfirm: () => this.updateStatus(self.filters.get(label)!),
          onCancel: () => {
            self.filters.get(label)?.setPrevValue();
          },
        });
      },
      updateStatus: flow(function* (filter: FilterInstance) {
        const { rkm, gkm } = CorrectionFilterNames;
        let stateCode = CorrectionStages.CORR_APPROVED;
        let method = 'rkm';
        if (filter.name === 'rkm') {
          stateCode =
            filter.selectedItem === 'on'
              ? CorrectionStages.CORR_SENTFORAPPROVAL
              : CorrectionStages.CORR_CREATED;

          // method = filter.selectedItem === 'on' ? 'rkm' : 'gkm';
        } else {
          stateCode =
            filter.selectedItem === 'on'
              ? CorrectionStages.CORR_APPROVED
              : CorrectionStages.CORR_SENTFORAPPROVAL;
          if (filter.selectedItem === 'on') {
            method = 'gkm';
            stateCode = CorrectionStages.CORR_APPROVED;
            self.filters.get(rkm)?.setDisabled(true);
          } else {
            method = 'rkm';
            stateCode = CorrectionStages.CORR_SENTFORAPPROVAL;
          }
        }

        if (self.filters.get(rkm)?.selectedItem === 'off') {
          self.filters.get(gkm)?.setDisabled(true);
        } else {
          self.filters.get(gkm)?.setDisabled(false);
        }

        if (self.filters.get(gkm)?.selectedItem === 'on') {
          self.filters.get(rkm)?.setDisabled(true);
        } else {
          self.filters.get(rkm)?.setDisabled(false);
        }

        const params = {
          stateCode,
          stageId: self.stageId,
          orgId: self.orgId,
          tbId: self.tbId,
        };

        apiActions.post<{ error: 0 | 1; description: string }>({
          requestArgs: {
            method: `business-plan/correction-agreement/${method}`,
            params,
          },
          onSuccess: (resp) => {
            if (resp.error === 1) {
              rootStore.ui.alert.setAlert({
                type: 'warning',
                title: 'Ошибка при изменении статуса согласования',
                message: resp.description,
                stay: true,
              });
            }

            rootStore.plan.table.updateCorrectionAgreement({
              name: self.name,
              filter,
            });
          },
          onError: () => {
            filter.setPrevValue();
          },
          successMessage: {
            title: `Новый статус согласования: `,
            message: `Организация: ${self.name}`,
          },
          errorMessage: 'Ошибка при изменении статуса согласования',
        });

        // rootStore.ui.alert.setAlert({
        //   type: 'success',
        //   title: `Новый статус согласования: `,
        //   message: `Организация: ${self.name}`,
        // });
      }),
      setFilters() {
        const { rkm, gkm } = CorrectionFilterNames;
        self.filters.set(gkm, {
          name: 'gkm',
          label: gkm,
          key: gkm,
          staticFilters: true,
        });

        self.filters.get(gkm)?.setFilterItems(
          Object.entries(CheckboxFilterValues).map((entry) => ({
            value: entry[0],
            label: entry[1],
          }))
        );

        self.filters.set(rkm, {
          name: 'rkm',
          label: rkm,
          key: rkm,
          staticFilters: true,
        });

        self.filters.get(rkm)?.setFilterItems(
          Object.entries(CheckboxFilterValues).map((entry) => ({
            value: entry[0],
            label: entry[1],
          }))
        );

        const currentCorrection = rootStore.plan.table.correctionStatus;

        currentCorrection.forEach((el) => {
          if (el.orgId === self.orgId) {
            if (el.stateCode === 'CORR_CREATED') {
              self.filters.get(gkm)?.setDisabled(true);
              return;
            }
            if (el.stateCode === 'CORR_SENTFORAPPROVAL') {
              self.filters.get(rkm)?.setFilter(CheckboxFilterValues.on, false);
              self.filters.get(gkm)?.setFilter(CheckboxFilterValues.off, false);
            }

            if (el.stateCode === 'CORR_APPROVED') {
              self.filters.get(gkm)?.setFilter(CheckboxFilterValues.on, false);
              self.filters.get(rkm)?.setFilter(CheckboxFilterValues.on, false);
              self.filters.get(rkm)?.setDisabled(true);
            }
          }
        });
        const { user } = rootStore;
        if (!user.roleExistsAny([...adminRoles, 'kib_skm_pln_rkm', 'kib_skm_pln_gkm'])) {
          self.filters.get(rkm)?.setDisabled(true);
          self.filters.get(gkm)?.setDisabled(true);
        }
      },
      init(data: PlanItemInstance) {
        self.stageId = data.id_stage!;
        self.tbId = data.id_tb!;
        self.orgId = data.id_org!;
        self.name = data.id_org_name!;

        this.setFilters();
        const prevStatus = rootStore.plan.table.updatedCorrectionStatuses.get(self.name);

        if (prevStatus) {
          self.filters.forEach((el) => {
            el.setFilter(prevStatus.get(el.name)!, false);
          });
        }

        self.isInit = true;
      },
    };
  });

export type CorrectionAgreementInstance = Instance<typeof CorrectionAgreementModel>;
