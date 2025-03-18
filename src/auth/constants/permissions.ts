export enum permissions {
  // users
  USERS_LIST = 'users.list',
  USERS_SHOW = 'users.show',
  USERS_CREATE = 'users.create',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',
  USERS_RESTORE = 'users.restore',
  USERS_LOGIN = 'users.login',
  USERS_GET_PERMISSIONS = 'users.getPermissions',
  USERS_SET_PERMISSIONS = 'users.setPermissions',
  USERS_GET_ROLES = 'users.getRoles',
  USERS_SET_ROLES = 'users.setRoles',
  // roles
  ROLES_LIST = 'roles.list',
  ROLES_SHOW = 'roles.show',
  ROLES_CREATE = 'roles.create',
  ROLES_UPDATE = 'roles.update',
  ROLES_DELETE = 'roles.delete',
  ROLES_RESTORE = 'roles.restore',
  ROLES_GET_PERMISSIONS = 'roles.getPermissions',
  ROLES_SET_PERMISSIONS = 'roles.setPermissions',
  // permissions
  PERMISSIONS_LIST = 'permissions.list',
  // persons
  PERSONS_LIST = 'persons.list',
  PERSONS_SHOW = 'persons.show',
  PERSONS_CREATE = 'persons.create',
  PERSONS_UPDATE = 'persons.update',
  PERSONS_DELETE = 'persons.delete',
  PERSONS_RESTORE = 'persons.restore',
}
