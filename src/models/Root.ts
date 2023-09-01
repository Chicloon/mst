import { getSnapshot, Instance, onAction, onSnapshot, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { Ui, User, Plan, Stages } from '.';
import { Alerts } from 'models/Alerts';
import { Auth } from 'models/Auth';
import { StagesSettings } from './StagesSettings/StagesSettings';

export const RootModel = types.model('Root', {
  auth: Auth,
  alerts: Alerts,
  ui: Ui,
  user: User,
  plan: Plan,
  stages: Stages,
  // admin: Admin,
  stagesSettings: StagesSettings,
});

export const initialState = {
  auth: {},
  alerts: {},
  ui: {},
  user: {},
  plan: {},
  stages: {},
  admin: {},
  stagesSettings: {},
};

export const rootStore = RootModel.create(initialState);

onSnapshot(rootStore, (snapshot) => {
  console.log('Snapshot: ', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}
