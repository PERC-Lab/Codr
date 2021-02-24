import { AccessControl } from 'role-acl';

const ac = new AccessControl();

ac.grant('user')                    // define new or modify existing role. also takes an array.
    .execute('read').on('groups')             // equivalent to .execute('read').on('groups', ['*'])
    .execute('read').on('projects')
    .execute('read').on('organization')
  .grant('admin')                   // switch to another role without breaking the chain
    .extend('user')                 // inherit role capabilities. also takes an array
    .execute('read').on('members')  // explicitly defined attributes
    .execute('read').on('permissions');

export default ac;