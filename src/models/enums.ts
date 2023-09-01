export enum LoadStatuses {
  pending = 'pending',
  done = 'done',
  error = 'error',
}

export enum StageTypes {
  ANNUAL = 'Годовое планирование',
  SEMIANNUAL = 'Корректировка 3-4 кв.',
}

export enum StageTypesShort {
  ANNUAL = 'Планирование',
  SEMIANNUAL = 'Корректировка',
}

export enum StageStates {
  CREATED = 'Создан',
  CORR_KM = 'Корректировка КМ/РКМ и Согласование ГКМ',
  CORR_BA = 'Корректировка БА',
  TRANSF_PLAN = 'Переброска планов внутри ТБ',
  TRANSF_PLAN_COMPLETE = 'Завершена переброска планов внутри ТБ',
  TRANSF_PLAN_PERETOK = 'Переброска планов внутри ТБ после перетоков',
  TRANSF_PLAN_PERETOK_COMPLETE = 'Завершена переброска планов внутри ТБ после перетоков',
  APPROVED = 'Утвержден',
}
