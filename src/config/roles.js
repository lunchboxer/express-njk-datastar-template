export const roles = [
  {
    name: 'admin',
    permissions: [
      'update_user',
      'delete_user',
      'create_role',
      'update_role',
      'delete_role',
      'create_user_role',
      'update_user_role',
      'delete_user_role',
    ],
  },
  {
    name: 'user',
    permissions: [],
  },
  {
    name: 'guest',
    permissions: [],
  },
]
