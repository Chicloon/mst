import { Instance, types } from 'mobx-state-tree';

const Alert = types
  .model('Alert', {
    type: types.optional(
      types.enumeration('Type', ['error', 'success', 'warning', 'info']),
      'success'
    ),
    title: '',
    message: types.optional(types.union(types.string, types.null), ''),
  })
  .actions(() => {
    let onClose = () => {};
    return {
      setOnCloseFunc(onCloseFunc = () => {}) {
        onClose = onCloseFunc;
      },
      runOnCloseFunc() {
        onClose();
      },
    };
  });

type AlertInstance = Instance<typeof Alert>;

export { Alert };
export type { AlertInstance };
