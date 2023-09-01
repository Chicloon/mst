import {
  types as t,
  flow,
  Instance,
  getParent,
  destroy,
  applySnapshot,
} from 'mobx-state-tree';
import { LoadStatuses } from './enums';
import { apiActions } from './actions';
import { state } from './states';

export type RawFilterData = {
  id: '';
  s_code: '';
  s_name: '';
};

type FilterTypes = 'checkbox' | 'toggle' | 'select';

export type FilterData = {
  label: string;
  value: string | number | null;
};

export const Filter = t
  .model('Filter', {
    // Имя фильтра, которое используется как уникальный идентификатор фильтра не влияет на работу модели
    name: t.string,

    // Ключ фильтра, который используется при получении выборки по фильтрам
    key: t.string,

    //Отображаемое имя фильтра
    label: '',

    // для SelectFilter
    // placeholder: '',
    // helperText: '',

    // Метод для получения фильтра
    method: 'info/filter',

    /* 
      Key в мапе - соответствует selectedItem, он же используется как label в компоненте фильтра
      Для чекбоксков {key - on | off, value - on | off}
      Для тогглов key: {'Левое значение', 'Привое значение'}, value: {'value1', 'value2'}
    */

    items: t.map(t.union(t.string, t.number, t.null)),

    // Выбранное значение фильтра для единичного фильтра (key в items)
    selectedItem: '',

    // Предыдущее значение фильтра для единичного фильтра (key в items)
    prevItem: '',

    isInit: false,

    /* 
      Данне НЕ подгружаются автоматически из method
      Для тогглов и чекбоксов автоматически равно false
    */

    staticFilters: false,

    // Взять полные названия для значений или сокращенные
    shortNames: false,

    // Множественный выбор, нескольких значений фильтра
    isMultiSelect: false,
    // multiSelected: t.optional(t.array(t.union(t.string, t.number)), []),
    multiSelected: t.optional(t.array(t.string), []),

    state: state('FilterState'),

    // Показывать кнопку для удаления всех элементов из фильтра (для мультиселекта)
    allowClearAll: true,

    // Грубина на котором находится родительская модель
    parentDepth: t.maybeNull(t.optional(t.number, 2)),

    type: t.optional(
      t.enumeration<FilterTypes>('FilterTypes', ['select', 'toggle', 'checkbox']),
      'select'
    ),

    // Обязательно два значения если тип фильтра toggle где key - заголовок, value - значение
    toggleValues: t.map(t.union(t.string, t.number)),

    isDisabled: false,
    showLabel: true,
  })
  .actions((self) => ({
    // Устанавливает выбранные значения для фильтра
    setFilter(key: string | string[], reload = true) {
      if (self.isMultiSelect) {
        if (Array.isArray(key)) {
          applySnapshot(self.multiSelected, key);
        } else {
          applySnapshot(
            self.multiSelected,
            self.multiSelected.includes(key)
              ? self.multiSelected.filter((e) => e !== key)
              : [...self.multiSelected, key]
          );
        }
      } else {
        if (key === null || key === undefined) {
          self.items.keys().next().value;
        } else {
          self.prevItem = self.selectedItem;
          self.selectedItem = key as string;
        }
      }
      if (self.parentDepth) {
        const { onFilterChange }: { onFilterChange: (name: string) => void } = getParent(
          self,
          self.parentDepth
        );
        onFilterChange && reload && onFilterChange(self.key);
      }
    },

    setSelectedById(id: string | number) {
      const selectedItem = [...self.items.entries()].find((el) => el[1] === id);
      if (selectedItem && selectedItem?.length > 0) {
        this.setFilter(selectedItem[0]);
      }
    },

    setFilterItems(data: FilterData[], keepSelected = false) {
      destroy(self.items);
      data.forEach((d) => d && self.items.set(d.label, d.value));

      // data.forEach((d) => d && self.items.set(d.label || d.value.toString(), d.value?.toString()));

      if (!keepSelected) {
        self.selectedItem = self.items.keys().next().value;
      }
      self.isInit = true;
    },
    setPrevValue() {
      self.selectedItem = self.prevItem;
    },
    setDisabled(disabled: boolean) {
      self.isDisabled = disabled;
    },
  }))
  .actions((self) => ({
    load: flow(function* () {
      if (self.type === 'toggle') {
        if (self.toggleValues.size !== 2) {
          console.error('Добавьте данные для toggle фильтра');
          return;
        }

        self.setFilterItems(
          [...self.toggleValues.entries()].map(([key, value]) => ({
            value: value,
            label: key,
          }))
        );
        self.isInit = true;
        return;
      }

      if (self.type === 'checkbox') {
        self.setFilterItems([
          { value: 'on', label: 'on' },
          { value: 'off', label: 'off' },
        ]);
        self.isInit = true;
        return;
      }

      if (self.staticFilters) {
        self.isInit = true;
        self.state = LoadStatuses.done;
        return;
      }

      yield apiActions.get<RawFilterData[]>({
        requestArgs: {
          method: self.method,
        },
        onSuccess: (data) => {
          const filterItems = data.map((el) => ({
            ...el,
            value: el.id,
            label: self.shortNames ? el.s_code : el.s_name,
          }));

          self.setFilterItems(filterItems);
        },
        errorMessage: `Ошибка при загрузке данных фильтра: ${self.label}`,
      });

      self.state = LoadStatuses.done;
      self.isInit = true;
    }),
    setMethod(method: string) {
      self.method = method;
      this.load();
    },
    afterCreate() {
      this.load();
    },
  }))
  .actions((self) => ({
    setLoading() {
      self.state = LoadStatuses.pending;
    },
    setDone() {
      self.state = LoadStatuses.done;
    },
  }))
  .views((self) => ({
    get idOfSelected() {
      return self.items.get(self.selectedItem);
    },
    get idMultiSelected() {
      return self.multiSelected.map((el) => self.items.get(el as string));
    },
    filterOptions(selectedOnTop = false) {
      const options = [...self.items.entries()].map(([key, value]) => ({
        value,
        label: key,
      }));

      if (!selectedOnTop) {
        return options;
      }

      if (self.multiSelected.length > 0) {
        const res = [
          ...options.filter(
            (el) => el.label && self.multiSelected.includes(el.label?.toString())
          ),
          ...options.filter(
            (el) => el.label && !self.multiSelected.includes(el.label?.toString())
          ),
        ];
        return res;
      }
      return options;
    },
  }));

export type FilterInstance = Instance<typeof Filter>;
