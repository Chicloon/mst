import { types, Instance, getSnapshot, applySnapshot } from 'mobx-state-tree';

const DURATION = 4000;

export type AlertArgs = {
  title: string;
  message?: string | null;
  type: 'error' | 'success' | 'warning' | 'info';
  stay?: boolean;
};

export type ConfirmationArgs = {
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const Alert = types
  .model('Alert', {
    show: false,
    title: types.optional(types.string, ''),
    message: types.optional(types.union(types.string, types.null), ''),
    type: types.optional(
      types.enumeration('Type', ['error', 'success', 'warning', 'info']),
      'success'
    ),
  })
  .actions((self) => ({
    hideAlert() {
      self.show = false;
    },
    setAlert({ title, message = '', type, stay = false }: AlertArgs) {
      applySnapshot(self, { ...getSnapshot(self), title, message, type, show: true });

      if (type === 'error') {
        stay = true;
      }

      if (!stay) {
        setTimeout(() => {
          this.hideAlert();
        }, DURATION);
      }
    },
  }));

export const Confirmation = types
  .model('Confiramtion', {
    show: false,
    content: '',
  })
  .actions((self) => {
    let runConfirmation = () => {};
    let runOnCancel = () => {};
    return {
      setConfirmation({ title, onConfirm, onCancel = () => {} }: ConfirmationArgs) {
        self.show = true;
        self.content = title;
        runConfirmation = onConfirm;
        runOnCancel = onCancel;
      },
      onConfirm() {
        self.show = false;
        runConfirmation();
      },
      onCancel() {
        self.show = false;
        runOnCancel();
      },
      hideConfirmation() {
        self.show = false;
      },
    };
  });

export const Ui = types
  .model('Ui', {
    alert: types.optional(Alert, {}),
    confirmation: types.optional(Confirmation, {}),
    lastUpdate: '',
  })
  .actions((self) => ({
    setLastUpdate(lastUpdate: string) {
      self.lastUpdate = lastUpdate;
    },
  }));

export type AlertInstance = Instance<typeof Alert>;
