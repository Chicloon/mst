import { types } from 'mobx-state-tree';
import { AlertType } from '@pcapcc360/react-ui/build/components/alert/types';

type AlertMessage = {
  type: AlertType;
  text: string | null;
  alertKey: string;
};

const Message = types
  .model('Message', {
    type: types.optional(
      types.enumeration('Type', ['error', 'success', 'warning', 'info']),
      'success'
    ),
    text: types.optional(types.union(types.string, types.null), ''),
    open: false,
    alertKey: '',
  })
  .actions((self) => ({
    set(alert: AlertMessage) {
      self.type = alert.type;
      self.text = alert.text;
      self.alertKey = alert.alertKey;
      self.open = true;
    },
    hide() {
      self.open = false;
    },
  }));

export { Message };
