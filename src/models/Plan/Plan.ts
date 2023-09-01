import { flow, Instance, types as t, getRoot, applySnapshot } from 'mobx-state-tree';
import { PlanTable } from './PlanTable';
import { PlanHeader } from './PlanHeader';
import { PlanItemInstance } from '.';
import api from 'api';
import { RootInstance } from 'models';
import { TableItem, TableItemInstance } from 'models/StagesSettings/Table';
import dayjs from 'dayjs';

export const PlanColoredRow = t.model('PlanRowColor', {
  color: 0,
});

export const Plan = t
  .model('PlanModel', {
    isInit: false,
    table: t.optional(PlanTable, {}),
    header: t.optional(PlanHeader, {}),
    idStage: 8177,
    stage: t.maybeNull(TableItem),
  })
  .views((self) => ({
    get factYear() {
      if (self.stage) {
        return parseInt(dayjs(self.stage.factDate).format('YYYY'));
      }
      return 0;
    },
  }))
  .actions((self) => ({
    setStage: flow(function* () {
      try {
        const data: TableItemInstance = yield api.get({
          method: 'info/plan/' + self.idStage,
        });
        self.stage = data;
        self.idStage = data.id!;
      } catch (err: any) {
        getRoot<RootInstance>(self).ui.alert.setAlert({
          type: 'error',
          title: 'Ошибка при загрузке этапа',
          message: err.message,
        });
      }
    }),
  }))
  .actions((self) => ({
    clearData() {
      self.isInit = false;
    },
    setId(id: number) {
      self.idStage = id;
      self.header.init();
    },
    init: flow(function* (id?: number) {
      id && (self.idStage = id);
      yield self.setStage();
      self.header.init();
      self.isInit = true;
    }),
  }));

export type PlanInstance = Instance<typeof Plan>;
export type PlanColoredRowInstance = Instance<typeof PlanColoredRow>;
