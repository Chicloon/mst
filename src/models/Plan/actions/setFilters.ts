import { flow, getParent, getRoot } from 'mobx-state-tree';
import { FilterData, RawFilterData } from 'models/Filter';
import { apiActions } from 'models/actions';
import { CheckboxFilterValues, PlanFilterNames, ReassignmentFilterValues } from '../enums';
import { PlanInstance } from '../Plan';
import { PlanHeaderInstance } from '../PlanHeader';

const setFilters: any = flow(function* (self: PlanHeaderInstance) {
  const parent = getParent<PlanInstance>(self);
  const stageId = parent.idStage as number;
  const factYear = parent.factYear as number;
  const { headersData } = parent.table;

  const {
    tb,
    xoGkmBranch,
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
    XO,
    SOGL,
    reassignment,
    perPage,
    showTotal,
    scale,
    showEmpty,
  } = PlanFilterNames;

  self.filters.set(tb, {
    name: tb,
    key: tb,
    label: 'ТБ',
    method: 'business-plan/filters-tb',
    isMultiSelect: true,
    shortNames: true,
  });
  self.filters.set(vko, {
    name: vko,
    key: vko,
    label: 'ВКО',
    method: 'business-plan/filters-vko' + '?stageId=' + stageId,
    isMultiSelect: true,
  });
  self.filters.set(gkm, {
    name: gkm,
    key: gkm,
    label: 'Направление',
    method: 'business-plan/filters-branch',
    isMultiSelect: true,
  });
  self.filters.set(XO, {
    name: XO,
    key: XO,
    label: 'XO',
    method: 'business-plan/filters-xo',
    isMultiSelect: true,
  });

  self.filters.set(name, {
    name: name,
    key: name,
    label: 'Организации включая',
    staticFilters: true,
    shortNames: true,
    isMultiSelect: true,
  });

  self.filters.set(name_negative, {
    name: name_negative,
    key: name_negative,
    label: 'Организации исключая',
    staticFilters: true,
    shortNames: true,
    isMultiSelect: true,
  });

  yield apiActions.get<RawFilterData[]>({
    requestArgs: {
      method: 'business-plan/filters-name' + '?stageId=' + stageId,
    },
    errorMessage: 'Ошибка при загрузке данных фильтра организаций',
    onSuccess: (filterData) => {
      const filterItems = filterData.map((el) => ({
        ...el,
        value: el.id,
        label: el.s_code,
      }));

      self.filters.get(name)?.setFilterItems(filterItems);
      self.filters.get(name_negative)?.setFilterItems(filterItems);
    },
  });

  self.filters.set(inn, {
    name: inn,
    key: inn,
    label: 'ИНН включая',
    isMultiSelect: true,
    staticFilters: true,
  });

  self.filters.set(inn_negative, {
    name: inn_negative,
    key: inn_negative,
    label: 'ИНН исключая',
    staticFilters: true,
    isMultiSelect: true,
  });

  yield apiActions.get<RawFilterData[]>({
    requestArgs: {
      method: 'business-plan/filters-inn' + '?stageId=' + stageId,
    },
    errorMessage: 'Ошибка при загрузке данных фильтра ИНН',
    onSuccess: (filterData) => {
      const filterItems = filterData.map((el) => ({
        ...el,
        value: el.id,
        label: el.s_code,
      }));

      self.filters.get(inn)?.setFilterItems(filterItems);
      self.filters.get(inn_negative)?.setFilterItems(filterItems);
    },
  });

  self.filters.set(SOGL, {
    name: SOGL,
    key: SOGL,
    label: 'Согласование',
    staticFilters: true,
    method: '',
    isMultiSelect: true,
  });

  self.filters.get(SOGL)?.setFilterItems([
    {
      value: 'rkm',
      label: 'Только организации, отмеченные РКМ для согласования',
    },
    {
      value: 'gkm',
      label: 'Только организации, отмеченные ГКМ для согласования',
    },
  ]);
  self.filters.get(SOGL)?.setFilter('');
  // Фильтры статей

  self.filters.set(article1, {
    name: article1,
    key: article1,
    label: 'Статья 1',
    method: '',
    isMultiSelect: true,
    staticFilters: true,
  });

  self.filters.set(article2, {
    name: article2,
    key: article2,
    label: 'Статья 2',
    method: '',
    isMultiSelect: true,
    staticFilters: true,
  });

  self.filters.set(article3, {
    name: article3,
    key: article3,
    label: 'Статья 3',
    method: '',
    isMultiSelect: true,
    staticFilters: true,
  });

  const { stage } = getParent<PlanInstance>(self);
  const type = stage?.type as string;

  //Чекбоксы
  self.filters.set(fact, {
    name: fact,
    key: fact,
    label: `${fact} ${type === 'ANNUAL' ? factYear - 2 : factYear - 1}`,
    method: '',
    staticFilters: true,
  });

  self.filters.get(fact)?.setFilterItems(
    Object.entries(CheckboxFilterValues).map((entry) => ({
      value: entry[0],
      label: entry[1],
    }))
  );

  self.filters.set(factPrognosis, {
    name: factPrognosis,
    key: factPrognosis,
    label: `${factPrognosis} ${type === 'ANNUAL' ? factYear - 1 : factYear}`,
    staticFilters: true,
  });

  self.filters.get(factPrognosis)?.setFilterItems(
    Object.entries(CheckboxFilterValues).map((entry) => ({
      value: entry[0],
      label: entry[1],
    }))
  );

  self.filters.set(xoGkmBranch, {
    name: xoGkmBranch,
    key: xoGkmBranch,
    label: xoGkmBranch,
    staticFilters: true,
  });

  self.filters.get(xoGkmBranch)?.setFilterItems(
    Object.entries(CheckboxFilterValues).map((entry) => ({
      value: entry[0],
      label: entry[1],
    }))
  );

  // Сортировка

  self.filters.set(sortByArticle, {
    name: sortByArticle,
    key: sortByArticle,
    label: 'Сортировка по статье',
    method: '',
    staticFilters: true,
  });

  self.filters.get(sortByArticle)?.setFilterItems(
    self.articles.map((el) => ({
      value: el.id as number,
      label: el.name as string,
    }))
  );

  self.filters.get(sortByArticle)?.setFilter('');

  self.filters.set(sortByColumn, {
    name: sortByColumn,
    key: sortByColumn,
    label: 'Сортировка по колонке',
    method: '',
    staticFilters: true,
    allowClearAll: false,
  });

  const sortByColumnItems: FilterData[] = [];

  const sortColumnItems = new Set<[string, string]>();

  headersData.forEach((el) => {
    sortColumnItems.add([el.s_column_name, `${el.s_column_group_caption} - ${el.s_column_caption}`]);
  });

  sortColumnItems.forEach((value, key) => {
    sortByColumnItems.push({
      value: value[0],
      label: value[1],
    });
  });

  self.filters.get(sortByColumn)?.setFilterItems(sortByColumnItems);
  self.filters.get(sortByColumn)?.setFilter('');

  self.filters.set(sortDirection, {
    name: sortDirection,
    key: sortDirection,
    label: 'Направление сортировки',
    method: '',
    staticFilters: true,
    allowClearAll: false,
  });

  self.filters.get(sortDirection)?.setFilterItems([
    {
      value: 'ASC',
      label: 'По возрастанию',
    },
    {
      value: 'DESC',
      label: 'По убыванию',
    },
  ]);

  // Перераспределение

  self.filters.set(reassignment, {
    name: reassignment,
    key: reassignment,
    label: 'Перераспределение',
    method: '',
    staticFilters: true,
  });

  self.filters.get(reassignment)?.setFilterItems(
    Object.entries(ReassignmentFilterValues).map((entry) => ({
      value: entry[0],
      label: entry[1],
    }))
  );

  self.filters.get(SOGL)?.setFilter('');

  const inits: Promise<void>[] = [];
  self.filters.forEach((f) => inits.push(f.load()));
  yield Promise.all(inits);

  // Количество записей на в таблице

  self.filters.set(perPage, {
    name: perPage,
    label: '',
    key: perPage,
    staticFilters: true,
    showLabel: false,
  });

  const maxPages = 500;

  self.filters.get(perPage)?.setFilterItems(
    new Array(Math.floor(maxPages / 60)).fill('').map((_, idx) => ({
      label: ((idx + 2) * 60).toString(),
      value: (idx + 2) * 60,
    }))
  );

  // Масштаб таблицы

  self.filters.set(scale, {
    name: scale,
    label: '',
    key: scale,
    showLabel: false,
    staticFilters: true,
  });

  self.filters.get(scale)?.setFilterItems([
    { label: 'M', value: 'm' },
    { label: 'S', value: 'S' },
    { label: 'xS', value: 'xs' },
  ]);

  // Показ ИТОГО
  self.filters.set(showTotal, {
    name: showTotal,
    label: showTotal,
    key: showTotal,
    staticFilters: true,
    type: 'checkbox',
  });

  self.filters.get(showTotal)?.setFilter(CheckboxFilterValues.off);

  // Показ Пустых организаций
  self.filters.set(showEmpty, {
    name: showEmpty,
    label: showEmpty,
    key: showEmpty,
    staticFilters: true,
    type: 'checkbox',
  });

  self.filters.get(showEmpty)?.setFilter(CheckboxFilterValues.off);
});

export default setFilters;
