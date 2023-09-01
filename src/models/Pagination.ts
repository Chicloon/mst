import { getParent, Instance, types } from 'mobx-state-tree';

export const Pagination = types
  .model('Pagination', {
    totalPages: types.optional(types.number, 0),
    totalElements: types.optional(types.number, 0),
    size: types.optional(types.number, 10),
    number: types.optional(types.number, 0),
    property: types.optional(types.string, ''),
    ignoreCase: types.optional(types.boolean, true),
    ascending: types.optional(types.boolean, true),
    currentPageNumber: 0,
    pageNumbers: 0,
    recordsNumber: 0,
    totalRecords: 0,
  })
  .actions((self) => ({
    setPage(page: number) {
      self.number = page;
      const parent: { load: () => void } = getParent(self);
      parent.load();
    },
    setSorting({ id, desc }: { id: string; desc: boolean }) {
      self.property = id;
      self.ascending = desc;
      const parent: { load: () => void } = getParent(self);
      parent.load();
    },
    initPagination(number: number, size: number) {
      self.number = number;
      self.size = size;
    },
    setPagination(number: number, totalElements: number, totalPages: number) {
      self.number = number;
      self.totalElements = totalElements;
      self.totalPages = totalPages;
    },
  }));

export type PaginationInstance = Instance<typeof Pagination>;
