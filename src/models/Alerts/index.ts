import { Instance, types } from 'mobx-state-tree';
import { Alert } from './Alert';
import { Message } from './Message';
import { AlertType } from '@pcapcc360/react-ui/build/components/alert/types';

type newAlertParams = {
  type: AlertType;
  title: string;
  message?: string;
  visibleDuration?: number;
  onClose?: () => void;
};

const Alerts = types
  .model('Alerts', {
    asMap: types.map(Alert),
    newId: '0',
    message: types.optional(Message, { type: 'success', text: '', open: false }),
  })
  .actions((self) => ({
    add({ type, title, message, visibleDuration, onClose }: newAlertParams) {
      self.asMap.set(self.newId, { title, message, type });

      const alert = self.asMap.get(self.newId);
      if (alert) alert.setOnCloseFunc(onClose);

      const sid = self.newId;
      if (visibleDuration) {
        setTimeout(() => {
          if (!self.message.open || self.message.alertKey != sid) this.delete(sid);
        }, visibleDuration);
      }
      self.newId = (+self.newId + 1).toString();
    },
    delete(key: string) {
      const alert = self.asMap.get(key);
      if (alert) alert.runOnCloseFunc();
      self.asMap.delete(key);
    },
    setMessage(key: string) {
      const alert = self.asMap.get(key);
      if (alert) {
        self.message.set({
          type: alert.type,
          text: alert.message,
          alertKey: key,
        });
      }
    },
  }));

type AlertsInstance = Instance<typeof Alerts>;
type AddAlert = AlertsInstance['add'];

export { Alerts };
export type {AlertsInstance, AddAlert}