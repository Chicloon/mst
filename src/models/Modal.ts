import { Instance, types as t } from 'mobx-state-tree';

export const Modal = t
  .model('Modal', {
    title: '',
    size: t.optional(t.enumeration('ModalSize', ['xs', 'sm', 'md', 'lg', 'xl']), 'xl'),

    isOpen: false,
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));

export type ModalInstance = Instance<typeof Modal>;
