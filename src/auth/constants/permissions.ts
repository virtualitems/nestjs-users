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
  USERS_GET_GROUPS = 'users.getGroups',
  USERS_SET_GROUPS = 'users.setGroups',
  // groups
  GROUPS_LIST = 'groups.list',
  GROUPS_SHOW = 'groups.show',
  GROUPS_CREATE = 'groups.create',
  GROUPS_UPDATE = 'groups.update',
  GROUPS_DELETE = 'groups.delete',
  GROUPS_RESTORE = 'groups.restore',
  GROUPS_GET_PERMISSIONS = 'groups.getPermissions',
  GROUPS_SET_PERMISSIONS = 'groups.setPermissions',
}
