import { types as t, Instance } from 'mobx-state-tree';

export const User = t
  .model('User', {
    roles: t.optional(t.array(t.string), []),
    isInit: false,
  })
  .actions((self) => ({
    init(roles: string[]) {
      if (!self.isInit) {
        self.roles.push(...roles);
        self.isInit = true;
      }
    },
  }))
  .views((self) => ({
    roleExistsAny(roles: string[]) {
      return roles.some((e) => self.roles.includes(e));
    },
    roleExistsAll(roles: string[]) {
      return roles.every((e) => self.roles.includes(e));
    },
  }));

export interface UserInstance extends Instance<typeof User> {}
