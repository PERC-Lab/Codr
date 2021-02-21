import { RBAC } from 'rbac'; // ES5 var RBAC = require('rbac').default;
const rbac = new RBAC({
  roles: ['admin', 'researcher', 'user', 'guest'],
  // resource: [ function ]
  permissions: {
    user: ['create', 'delete'],
    profile: ['update'],
    password: ['change', 'forgot'],
    project: ['create'],
    rbac: ['update'],
  },
  // userType: [ permissions ]
  grants: {
    guest: ['create_user', 'forgot_password'],
    user: ['change_password', 'update_profile'],
    researcher: ['user'],
    admin: ['researcher', 'delete_user', 'update_rbac'],
  },
});

await rbac.init();