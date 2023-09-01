import { flow } from 'mobx-state-tree';
import { requestAction, RequestActionArgs } from './requestAction';

const post = flow(function* <T>(args: RequestActionArgs<T>) {
  yield requestAction(args, 'post');
});
const get = flow(function* <T>(args: RequestActionArgs<T>) {
  yield requestAction(args, 'get');
});
const patch = flow(function* <T>(args: RequestActionArgs<T>) {
  yield requestAction(args, 'patch');
});
const deleteAction = flow(function* <T>(args: RequestActionArgs<T>) {
  yield requestAction(args, 'delete');
});

export default { get, post, patch, delete: deleteAction };
