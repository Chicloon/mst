import { applySnapshot, destroy, flow, getRoot, Instance, types as t, getParent } from 'mobx-state-tree';
import { apiActions, FilterInstance, LoadStatuses, PlanInstance, RootInstance } from 'models';
import { BPtypes, PlanFilterNames } from './enums';
import { state } from 'models/states';
import { PlanItem, PlanItemInstance } from './PlanItems';
import { Pagination } from './Pagination';
import { tableResponseToTableData } from './utils';
import { CELL_HEIGHT } from 'pages/Plan/Plan';

export type PlanData = {
  id_org_code: string;
  s_article_lvl_1_name: string;
  s_article_lvl_2_name: string;
} & {
  [key: string]: string;
};

export type PlanHeader = {
  s_column_name: string;
  s_column_caption: string;
  s_column_group_caption: string;
  n_color: number;
};

const PlanHeaderData = t.model('PlanHeaderItem', {
  s_column_name: t.string,
  s_column_caption: t.string,
  s_column_group_caption: t.string,
  n_color: t.number,
});

const CorrectionStatus = t.model('CorrectionStatus', {
  stageId: 0,
  orgId: 0,
  tbId: 0,
  stateId: 0,
  stateCode: '',
});

export const PlanTable = t
  .model('PlanTable', {
    items: t.optional(t.array(PlanItem), []),
    tbTotal: t.optional(t.array(PlanItem), []),
    headersData: t.optional(t.array(PlanHeaderData), []),
    state: state('PlanTable'),
    editedCells: t.map(t.map(t.union(t.string, t.number, t.null))),
    nowEditing: 'comment',
    type: t.optional(t.enumeration('PlanTypes', Object.values(BPtypes)), BPtypes.inn),
    pagination: t.optional(Pagination, { perPage: 500 }),
    correctionStatus: t.optional(t.array(CorrectionStatus), []),
    isInit: false,
    scrolledBy: 0,
    updatedCorrectionStatuses: t.map(t.map(t.string)),
    cellHeight: CELL_HEIGHT,
  })
  .views((self) => ({
    get correctionBody() {
      const correction: { [key: string]: any } = {};

      const parent = getParent<PlanInstance>(self);
      const idStage = parent.idStage as number;

      self.items.length > 0 &&
        [...self.editedCells.entries()].forEach((el) => {
          const item = self.items.find((item) => item.id === +el[0])!;
          const key = JSON.stringify([{ idStage, idTb: item.id_tb, idOrg: item.id_org }]);
          if (correction[key]?.correctionItem) {
            correction[key] = {
              correctionItem: [
                ...correction[key].correctionItem,
                ...[...el[1].entries()].map((el) => ({
                  idArticle: item.id_article_lvl3,
                  sPeriodType: el[0].toUpperCase(),
                  fValue: Number(el[1]),
                })),
              ],
            };
          } else {
            correction[key] = {
              correctionItem: [...el[1].entries()].map((el) => ({
                idArticle: item.id_article_lvl3,
                sPeriodType: el[0].toUpperCase(),
                fValue: Number(el[1]),
              })),
            };
          }
        });

      const correctionBody: {
        correction: {
          correctionHeader: string;
          correctionItem: any;
        }[];
      } = {
        correction: [],
      };

      Object.entries(correction).forEach((corr) => {
        correctionBody.correction.push({
          correctionHeader: JSON.parse(corr[0]),
          correctionItem: corr[1].correctionItem,
        });
      });

      return correctionBody;
    },

    get tableItems(): any[] {
      const {
        header: { showTotal },
      } = getParent<PlanInstance>(self);

      const tableData = showTotal ? [...self.tbTotal, ...self.items] : self.items;

      const tableItems = self.items.length > 0 ? tableResponseToTableData(tableData, self.type) : [];
      return tableItems;
    },
  }))

  // Настройка отображения таблицы
  .views((self) => {
    const getHeader = () => {
      const {
        plan: { header },
      } = getRoot<RootInstance>(self);
      return header;
    };
    return {
      get fontSize(): string {
        const scaleValue = getHeader().filters.get('scale')?.selectedItem.toLocaleLowerCase();
        const fontSize = scaleValue == 's' ? 'x-small' : scaleValue === 'xs' ? 'xx-small' : 'inherit';
        return fontSize;
      },
      get lineHeight(): string {
        const scaleValue = getHeader().filters.get('scale')?.selectedItem.toLocaleLowerCase();
        const lineHeight = scaleValue == 's' ? '10px' : scaleValue === 'xs' ? '5px' : '20px';
        return lineHeight;
      },
      get scaleCoefficient(): number {
        const scaleValue = getHeader().filters.get('scale')?.selectedItem!;
        let scale = 1;
        if (!scaleValue) {
          return scale;
        }

        switch (scaleValue.toLowerCase()) {
          case 's':
            scale = 1.5;
            break;
          case 'xs':
            scale = 2;
            break;
          default:
            scale = 1;
        }

        return scale;
      },
    };
  })

  // Заголовки и пагинация
  .views((self) => ({
    get headers(): { data: { [key: string]: any }; showXO: boolean } | null {
      const {
        header: { hiddenHeader, showXO },
      } = getParent<PlanInstance>(self);

      if (self.headersData.length === 0) {
        return null;
      }
      const objHeaders: { [key: string]: any } = {};

      self.headersData
        .filter((el) => !hiddenHeader.includes(el.s_column_name))
        .forEach((el) => {
          objHeaders[el.s_column_group_caption] = {
            ...objHeaders[el.s_column_group_caption],
            [el.s_column_name]: {
              name: el.s_column_name.toLocaleLowerCase(),
              caption: el.s_column_caption,
              color: el.n_color,
            },
          };
        });

      return { data: objHeaders, showXO };
    },
  }))
  .actions((self) => ({
    nextPage: flow(function* () {
      yield self.pagination.nextPage(true);
    }),
    setScale(scale: string) {
      switch (scale.toLocaleLowerCase()) {
        case 's':
          self.cellHeight = CELL_HEIGHT / 1.5;
          break;
        case 'xs':
          self.cellHeight = CELL_HEIGHT / 2;
          break;
        default:
          self.cellHeight = CELL_HEIGHT;
      }
    },
  }))
  /*
      API requests
  */
  .actions((self) => {
    return {
      getTableItemsLength: flow(function* (): Generator<PromiseLike<any>, void, any> {
        const parent = getParent<PlanInstance>(self);
        const filterParams = parent.header.filterParams as { [key: string]: any };
        const sortingParams = parent.header.sortingParams as { [key: string]: any };
        const pIdStage = parent.idStage as number;
        const params = {
          stageId: pIdStage,
        };

        const body =
          self.type !== BPtypes.segment
            ? {
                filters: filterParams,
                sorting: sortingParams,
              }
            : {};

        yield apiActions.post<number>({
          requestArgs: {
            method: 'business-plan/inn-rows-quantity',
            body,
            params,
          },
          onSuccess: (resp) => {
            self.pagination.setTotalElements(resp);
          },
          errorMessage: 'Ошибка при загрузке количества записей бизнес-плана',
        });
      }),
      load: flow(function* (addNewData = true) {
        self.nowEditing = '';
        const parent = getParent<PlanInstance>(self);
        const filterParams = parent.header.filterParams as { [key: string]: any };
        const sortingParams = parent.header.sortingParams as { [key: string]: any };
        const pIdStage = parent.idStage as number;

        if (parent.header.showCorrectionAgreement) {
          destroy(self.correctionStatus);
          yield apiActions.get<Instance<typeof CorrectionStatus>[]>({
            requestArgs: {
              method: 'business-plan/correction/state',
              params: {
                stageId: pIdStage,
                tbId: filterParams[PlanFilterNames.tb][0].value,
              },
            },
            onSuccess: (resp) => {
              applySnapshot(self.correctionStatus, resp);
            },
          });
        }

        const params = {
          stageId: pIdStage,
          accountId: -1,
          pageNumber: self.pagination.page,
          rowsQuantity: self.pagination.perPage,
        };

        const body = {
          filters: filterParams,
          sorting: sortingParams,
        };

        yield apiActions.post<PlanItemInstance[]>({
          requestArgs: {
            method: 'business-plan/' + self.type,
            params,
            body,
          },
          onSuccess: (items) => {
            if (addNewData) {
              applySnapshot(self.items, [...self.items, ...items]);
              return;
            }
            applySnapshot(self.items, items);
          },
          onNoData: () => {
            destroy(self.items);
          },
          onError: () => {
            self.state = LoadStatuses.error;
          },
          errorMessage: 'Ошибка при загрузке бизнес-плана',
        });
      }),

      loadTbTotal: flow(function* (): Generator<PromiseLike<any>, void, any> {
        const {
          idStage: stageId,
          header: { showTotal, filterParams, sortingParams },
        } = getParent<PlanInstance>(self);

        destroy(self.tbTotal);

        const body = {
          filters: filterParams,
          sorting: sortingParams,
        };

        const params = {
          stageId,
        };

        yield apiActions.post<PlanItemInstance[]>({
          requestArgs: {
            method: 'business-plan/total-tb',
            params,
            body,
          },
          onSuccess: (items) => {
            applySnapshot(self.tbTotal, items);
          },
          onNoData: () => {
            destroy(self.items);
          },
          onError: () => {
            self.state = LoadStatuses.error;
          },
          errorMessage: 'Ошибка при загрузке ИТОГО по ТБ',
        });
      }),

      loadHeaders: flow(function* () {
        const parent = getParent<PlanInstance>(self);
        const stageId = parent.idStage as number;

        const {
          header: { hiddenHeader },
        } = getParent<PlanInstance>(self);

        destroy(self.headersData);

        yield apiActions.get<PlanHeader[]>({
          requestArgs: {
            method: 'business-plan/header-decode/',
            params: {
              stageId,
              stageType: self.type.toUpperCase(),
            },
          },
          onSuccess: (headers) => {
            applySnapshot(self.headersData, headers);
          },
          errorMessage: 'Ошибка при загрузке заголовков бизнес-плана',
        });
      }),
    };
  })

  // Скролл
  .actions((self) => {
    let prevScroll = 0;
    return {
      setScroll(scrolledBy: number) {
        if (scrolledBy !== prevScroll) {
          self.scrolledBy = scrolledBy;
        }
        prevScroll = scrolledBy;
      },
    };
  })

  // Очистка данных
  .actions((self) => ({
    clearFilters() {
      const {
        header: { clearFilters },
      } = getParent<PlanInstance>(self);

      clearFilters && clearFilters();
    },
    clearData() {
      destroy(self.items);
      destroy(self.editedCells);
      self.pagination.setPage(1);
    },
  }))
  // Загрузка данных
  .actions((self) => {
    return {
      init: flow(function* () {
        self.isInit = false;
        self.clearData();
        self.clearFilters();
        self.getTableItemsLength();
        self.loadHeaders();
        yield self.load();
        self.isInit = true;
        self.state = LoadStatuses.done;
      }),
      setType: flow(function* (type: BPtypes) {
        self.state = LoadStatuses.pending;
        self.type = type;
        self.clearData();
        self.clearFilters();
        self.getTableItemsLength();
        self.loadHeaders();
        yield self.load();
        self.state = LoadStatuses.done;
      }),

      applyFilters: flow(function* () {
        self.state = LoadStatuses.pending;
        self.clearData();
        yield self.getTableItemsLength();

        const loadData = [self.load()];
        self.type === BPtypes.inn && loadData.push(self.loadTbTotal());

        yield Promise.all(loadData);
        self.state = LoadStatuses.done;
      }),
    };
  })

  // Редактирование ячеек и корректировок
  .actions((self) => ({
    setEditedCell(idx: string, columnId: string, value: string | number | null) {
      const prevValue = self.editedCells.get(idx);

      if (!prevValue) {
        self.editedCells.set(idx, {
          [columnId]: value,
        });
      } else {
        prevValue.set(columnId, value);
      }
    },
    clearEditing() {
      destroy(self.editedCells);
      self.nowEditing = '';
    },
    setNowEditing(uuid: string) {
      self.nowEditing = uuid;
    },
    removeFromEditedCell(idx: string, columnId: string) {
      const prevValue = self.editedCells.get(idx);
      if (prevValue) {
        prevValue.delete(columnId);
        if ([...prevValue.values()].length === 0) {
          self.editedCells.delete(idx);
        }
      }
      self.nowEditing = '';
    },

    updateCorrectionAgreement({ name, filter }: { name: string; filter: FilterInstance }) {
      if (self.updatedCorrectionStatuses.has(name)) {
        self.updatedCorrectionStatuses.get(name)!.set(filter.name, filter.selectedItem);
      } else {
        const newCorrection = { [filter.name]: filter.selectedItem };
        self.updatedCorrectionStatuses.set(name, newCorrection);
      }
    },

    reassignCell: flow(function* (data: PlanItemInstance, columnId: string, fValue: string | number | null) {
      const { header } = getParent<PlanInstance>(self);

      const uniqOrgIds = header.uniqOrgIds as any[];
      const idOrgTo = +uniqOrgIds.find((el: any) => +el !== data.id_org);

      const body = {
        transfer: {
          idStage: data.id_stage,
          idTb: data.id_tb,
          idOrgFrom: data.id_org,
          idOrgTo,
          idArticle: data.id_article_lvl3,
          sPeriodType: columnId.toUpperCase(),
          fValue: fValue ? parseFloat(fValue as string) : null,
        },
      };
      yield apiActions.post({
        requestArgs: {
          method: 'business-plan/transfer',
          body,
        },
        onSuccess: () => {
          self.load(false);
        },
        successMessage: 'Переброска успешна',
      });
    }),
  }));
export type PlanTableInstance = Instance<typeof PlanTable>;
