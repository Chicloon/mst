import { types as t, Instance, destroy, onSnapshot } from 'mobx-state-tree';

export const EditCellModel = t
  .model('EditCellModel', {
    nowEditing: '',
    editedCells: t.map(t.map(t.union(t.string, t.number, t.null))),
    prevValues: t.map(t.map(t.union(t.string, t.number, t.null))),
  })
  .actions((self) => ({
    setPrevValue(idx: string, columnId: string, value: string | number | null) {
      if (!self.prevValues.has(idx)) {
        self.prevValues.set(idx, { [columnId]: value });
      }
    },
    setEditedCell(idx: string, columnId: string, value: string | number | null) {
      self.editedCells.set(idx, {
        [columnId]: value,
      });
    },
    clearEditing() {
      destroy(self.editedCells);
      self.nowEditing = '';
    },
    setNowEditing(uuid: string) {
      self.nowEditing = uuid;
    },
    removeFromEditedCell(idx: string, columnId: string) {
      self.editedCells.delete(idx);
      self.nowEditing = '';
    },
    clearAllData() {
      self.nowEditing = '';
      destroy(self.editedCells);
      destroy(self.prevValues);
    },
  }));

export type EditCellModelInstance = Instance<typeof EditCellModel>;

export const editCellStore = EditCellModel.create();
