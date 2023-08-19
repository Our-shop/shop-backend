export enum UserPermissions {
    All = 'permissions.all',
    RefreshToken = 'permissions.auth.refresh-token',
    SignOut = 'permissions.auth.sign-out',
    Restricted = 'permissions.restricted',
    Guest = 'permissions.guest',

    // ============== users ==========
    GetUsers = 'permissions.users.get-users',
    GetUserInfo = 'permissions.users.get-user-info',
}
