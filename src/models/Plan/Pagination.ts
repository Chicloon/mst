import { flow, getParent, types as t } from 'mobx-state-tree';

export const Pagination = t
  .model('Pagination', {
    page: 1,
    perPage: 0,
    totalElements: 0,
  })
  .views((self) => ({
    get totalPages() {
      const totalPages = self.totalElements
        ? Math.floor(self.totalElements / self.perPage)
        : 0;
      return totalPages;
    },
  }))
  .actions((self) => ({
    setPage(page: number) {
      self.page = page;
    },
    setPerPage(items: number) {
      self.perPage = items;
    },
    setTotalElements(items: number) {
      self.totalElements = items;
    },
    nextPage: flow(function* (addData = false) {
      // yield getParent<{ load: () => Promise<any> }>(self).load();
      if (self.totalElements > self.page * self.perPage) {
        self.page = self.page + 1;
        yield getParent<{ load: (addData: boolean) => Promise<any> }>(self).load(addData);
      }
    }),
  }));
