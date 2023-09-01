export enum PlanFilterNames {
  name = 'name',
  name_negative = 'nameNegative',
  inn = 'inn',
  inn_negative = 'innNegative',
  factPrognosis = 'Факт/Прогноз',
  fact = 'Факт',
  vko = 'vko',
  gkm = 'BRANCH',
  tb = 'tb',
  XO = 'XO',
  SOGL = 'sogl',
  soglas = 'sogl',
  attachment = 'Прикрепление',
  article1 = 'articleLvl1',
  article2 = 'articleLvl2',
  article3 = 'articleLvl3',
  sortByArticle = 'sort_articleLvl3',
  sortByColumn = 'sort_columnName',
  sortDirection = 'sort_order',
  xoGkmBranch = 'Группа/ГКМ/Направление',
  reassignment = 'Перераспределение',
  perPage = 'perPage',
  showTotal = 'ИТОГО',
  scale = 'scale',
  showEmpty = 'Пустые организации',
}

export enum ReassignmentFilterValues {
  editing = 'Редактирование',
  reassignment = 'Перераспределение',
}

export enum CheckboxFilterValues {
  off = 'off',
  on = 'on',
}

export enum CorrectionFilterItems {
  CORR_CREATED = 'Создана',
  CORR_SENTFORAPPROVAL = 'Отправлена на согласование',
  CORR_APPROVED = 'Согласована',
  CORR_NOTAPPROVED = 'Не согласована',
  CORR_ANNULED = 'Аннулирована',
}

export enum BPtypes {
  inn = 'inn',
  branch = 'branch',
  segment = 'segment',
}
