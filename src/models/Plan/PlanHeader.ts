import {
  applySnapshot,
  destroy,
  flow,
  getParent,
  getRoot,
  getSnapshot,
  Instance,
  types as t,
} from 'mobx-state-tree';
import {
  Filter,
  FilterData,
  PlanInstance,
  PlanItemInstance,
  RootInstance,
  apiActions,
} from 'models';
import { PlanFilterNames, ReassignmentFilterValues } from './enums';
import { PlanTableInstance } from './PlanTable';
import { _setFilters, updateArticlesFilters } from './actions';
import { hiddenHeadersView } from './views';
import { TableItem as ArticleItem } from 'models/StagesSettings/ArticlesModel';
import { ReassignmentOrgInfo } from './types';

const {
  name,
  name_negative,
  inn,
  inn_negative,
  vko,
  gkm,
  tb,
  XO,
  SOGL,
  article1,
  article2,
  article3,
  fact,
  factPrognosis,
  sortByArticle,
  sortByColumn,
  sortDirection,
  xoGkmBranch,
  reassignment,
  perPage,
  showTotal,
  scale,
} = PlanFilterNames;

const defaultFilterValue = JSON.stringify({ filter: {}, sorting: {} });
export const PlanHeader = t
  .model('PlanHeader', {
    filters: t.map(Filter),
    expanded: false,
    isInit: false,
    articles: t.optional(t.array(ArticleItem), []),
    prevParams: defaultFilterValue,
    displayReassignment: false,
    displayCorrectionAgreement: false,
  })

  // Filters
  .views((self) => {
    return {
      get filterParams() {
        const filters = [
          name,
          name_negative,
          inn,
          inn_negative,
          vko,
          gkm,
          tb,
          XO,
          SOGL,
          article1,
          article2,
          article3,
        ];

        const filterParams: { [key: string]: any } = {};

        self.filters.forEach((filter) => {
          if (filters.includes(filter.name as PlanFilterNames)) {
            if (filter.isMultiSelect && filter.multiSelected.length > 0) {
              filterParams[filter.key] = filter.multiSelected.map((el) => ({
                value: filter.items.get(el as string),
              }));
            }
          }
        });
        return filterParams;
      },
      get filtersApplied() {
        const currentParams = JSON.stringify({
          filter: this.filterParams,
          sorting: this.sortingParams,
        });
        return self.prevParams === currentParams;
      },
      get uniqOrgIds() {
        let ids: any[] = [];
        if ([...self.filters].length === 0) {
          return ids;
        }
        if (!self.filters.has(name) || !self.filters.has(inn)) {
          return ids;
        }
        const uniqOrgIds = new Set([
          ...self.filters.get(name)!.idMultiSelected.map((el) => +el!),
          ...self.filters.get(inn)!.idMultiSelected.map((el) => +el!),
        ]);
        ids = [...uniqOrgIds];
        return ids;
      },
      get reassignmentOrgs(): ReassignmentOrgInfo[] | null {
        if (this.uniqOrgIds.length !== 2) {
          return null;
        }

        const res: any[] = [];

        this.uniqOrgIds.forEach((el) => {
          const orgInfo = {} as ReassignmentOrgInfo;
          self.filters.get(name)!.items.forEach((value, key) => {
            if (value && el === +value) {
              orgInfo.name = key as string;
            }
          });

          self.filters.get(inn)!.items.forEach((value, key) => {
            if (value && el === +value) {
              orgInfo.inn = key;
            }
          });

          res.push(orgInfo);
        });

        return res;
      },
      get showCorrectionAgreement() {
        let show = false;

        if (
          self.filters.get(tb)?.multiSelected.length === 1 &&
          this.uniqOrgIds.length === 1
        ) {
          show = true;
        }
        return show;
      },
      get showXO() {
        return self.filters.get(PlanFilterNames.xoGkmBranch)?.selectedItem === 'on';
      },
      get showReassignment() {
        const { table } = getParent<PlanInstance>(self);

        let show = false;

        if (
          self.filters.get(tb)?.multiSelected.length === 1 &&
          this.uniqOrgIds.length === 2
        ) {
          show = true;
        }

        return show;
      },
      get showTotal() {
        return (
          self.filters.get(PlanFilterNames.tb)?.multiSelected &&
          self.filters.get(PlanFilterNames.tb)?.multiSelected.length! > 0 &&
          self.filters.get(showTotal)?.selectedItem === 'on'
        );
      },
      get editMode() {
        return (
          self.filters.get(reassignment)?.selectedItem ===
          ReassignmentFilterValues.editing
        );
      },

      get hiddenHeader() {
        return hiddenHeadersView(self);
      },
      get sortingParams() {
        if (
          self.filters.get(sortByArticle)?.selectedItem &&
          self.filters.get(sortByColumn)?.selectedItem &&
          self.filters.get(sortDirection)?.selectedItem
        ) {
          return {
            articleLvl3: self.filters.get(sortByArticle)?.idOfSelected,
            columnName: self.filters.get(sortByColumn)?.idOfSelected,
            order: self.filters.get(sortDirection)?.idOfSelected,
          };
        }

        return {};
      },
      get articleFilterApplied() {
        const articleFilters = [article1, article2, article3];

        let isApplied = false;
        articleFilters.forEach((el) => {
          if (self.filters.get(el)!.multiSelected.length > 0) {
            isApplied = true;
          }
        });
        return isApplied;
      },
      get selectedFilters() {
        const selected = [];

        const baseNames = [tb, factPrognosis, vko, gkm] as string[];

        self.filters.forEach((el) => {
          if (el.selectedItem !== ' ' && !baseNames.includes(el.name)) {
            selected.push(el);
          }
        });
        return selected.length;
      },
    };
  })
  .actions((self) => ({
    updateArticlesFilters(label?: PlanFilterNames) {
      updateArticlesFilters(self, label);
    },
  }))

  // Верхняя панель и действия
  .actions((self) => {
    const {
      ui: {
        alert: { setAlert },
        confirmation: { setConfirmation },
      },
    } = getRoot<RootInstance>(self);
    const { table } = getParent<PlanInstance>(self);
    const _applyFilters = () => {
      self.displayCorrectionAgreement = self.showCorrectionAgreement ? true : false;
      self.displayReassignment = self.showReassignment ? true : false;

      self.prevParams = JSON.stringify({
        filter: self.filterParams,
        sorting: self.sortingParams,
      });
      table.applyFilters();
    };
    return {
      setExpanded(expand: boolean) {
        self.expanded = expand;
      },
      reload() {
        if ([...table.editedCells].length !== 0) {
          setConfirmation({
            title:
              'У вас есть не сохраненные ячейки. Обновление таблицы придет к потере изменений. Продолжить?',
            onConfirm: () => this.applyFilters(),
          });
        } else {
          this.applyFilters();
        }
      },
      saveChanges: flow(function* () {
        const table = getParent<PlanInstance>(self).table as PlanTableInstance;
        const correctionBody = table.correctionBody as any;
        const stageId = getParent<PlanInstance>(self).idStage as number;
        const params = { stageId, accountId: 1 };
        const body = correctionBody;

        yield apiActions.post<{ description: string; error: 0 | 1 }>({
          requestArgs: {
            method: 'business-plan/correction-input',
            body,
            params,
          },
          onSuccess: (resp) => {
            if (resp.error === 1) {
              setAlert({
                type: 'error',
                title: 'Превышен лимит корректировок',
                message: resp.description,
              });
              return;
            }
            setAlert({
              type: 'success',
              title: 'Корректировка создана',
              message: resp.description,
            });

            _applyFilters();
          },
          errorMessage: 'Ошибка при сохранении изменений в БП',
        });
      }),
      applyFilters() {
        _applyFilters();
      },
      clearFilters() {
        self.filters.forEach((el) => {
          if (el.isMultiSelect) {
            el.setFilter([], false);
          }
        });
        self.prevParams = defaultFilterValue;
        self.displayReassignment = false;
        self.displayCorrectionAgreement = false;
        self.filters.get(reassignment)?.setFilter(ReassignmentFilterValues.editing);
        self.filters.get(showTotal)?.setFilter('off');
      },
    };
  })
  .actions((self) => {
    const allFilterItems: { [key: string]: any } = {};
    const plan = getParent<PlanInstance>(self);
    return {
      getArticlesMap: flow(function* () {
        const idStage = plan.idStage as number;

        destroy(self.articles);
        yield apiActions.get<(typeof ArticleItem)[]>({
          requestArgs: {
            method: `info/plan/${idStage}/article`,
          },
          onSuccess: (data) => {
            applySnapshot(self.articles, data);
          },
          errorMessage: 'Ошибка при получении справочника статей',
        });
      }),
      onFilterChange: flow(function* (filterKey: PlanFilterNames) {
        const filterFilterItems = async (positive: string, negative: string) => {
          const positiveFilter = self.filters.get(positive)!;
          const negativeFilter = self.filters.get(negative)!;

          if (!allFilterItems[positiveFilter.name]) {
            allFilterItems[positiveFilter.name] = getSnapshot(positiveFilter.items);
          }

          if (!allFilterItems[negativeFilter.name]) {
            allFilterItems[negativeFilter.name] = getSnapshot(negativeFilter.items);
          }

          const newPositiveItems: FilterData[] = [];
          const newNegativeItems: FilterData[] = [];

          Object.entries(allFilterItems[positiveFilter.name]).forEach((el) => {
            const key = el[0];
            const value = el[1] as string | number;
            if (!negativeFilter?.multiSelected.includes(key)) {
              newPositiveItems.push({ value: value, label: key });
            }
          });

          Object.entries(allFilterItems[negativeFilter.name]).forEach((el) => {
            const key = el[0];
            const value = el[1] as string | number;
            if (!positiveFilter?.multiSelected.includes(key)) {
              newNegativeItems.push({ value: value, label: key });
            }
          });

          positiveFilter?.setFilterItems(newPositiveItems, true);
          negativeFilter?.setFilterItems(newNegativeItems, true);
        };

        if (filterKey === inn || filterKey === inn_negative) {
          yield filterFilterItems(inn, inn_negative);
        }

        if (filterKey === name || filterKey === name_negative) {
          yield filterFilterItems(name, name_negative);
        }

        if ([article1, article2, article3].includes(filterKey)) {
          self.updateArticlesFilters(filterKey);
          return;
        }
        if (filterKey === reassignment) {
          const { table } = getParent<PlanInstance>(self);

          if (table.editedCells.size === 0) {
            return;
          }

          getRoot<RootInstance>(self).ui.confirmation.setConfirmation({
            title:
              'У вас есть не сохраненные ячейки. Переход в режим перераспределения  придет к потере изменений. \n\nПродолжить?',
            onConfirm: () => {
              table.clearEditing();
            },
            onCancel: () => {
              self.filters
                .get(reassignment)
                ?.setFilter(ReassignmentFilterValues.editing, false);
            },
          });
        }

        if (filterKey === perPage) {
          getParent<PlanInstance>(self).table.pagination.setPerPage(
            parseInt(self.filters.get(perPage)?.selectedItem || '')
          );
        }

        if (filterKey === scale) {
          getParent<PlanInstance>(self).table.setScale(
            self.filters.get(scale)?.selectedItem!
          );
        }
      }),
    };
  })
  .actions((self) => ({
    init: flow(function* () {
      yield self.getArticlesMap();
      yield _setFilters(self);
      self.updateArticlesFilters();
      self.isInit = true;
    }),
  }));

export type PlanHeaderInstance = Instance<typeof PlanHeader>;
