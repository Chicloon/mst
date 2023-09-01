import { types as t } from 'mobx-state-tree';
import { LoadStatuses } from './enums';

export const state = (modelName: string) =>
  t.optional(t.enumeration<LoadStatuses>(modelName + 'state', Object.values(LoadStatuses)), LoadStatuses.pending);
