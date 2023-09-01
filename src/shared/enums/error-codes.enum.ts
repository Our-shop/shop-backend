export enum ErrorCodes {
  InvalidForm = 'errors.invalid-form',

  FieldShouldBeString = 'errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.field-invalid.should-be-email',

  NotAuthorizedRequest = 'errors.not-authorized.request',

  InvalidStatus_UserInactive = 'errors.invalid-status.user-inactive',

  NotExists_User = 'errors.not-exists.user',
  Exists_User = 'errors.already-exists.user',

  NotCorrect_Password = 'errors.not-correct.password',

  InvalidTokens = 'errors.invalid-tokens',

  NotFound_User_Role = 'errors.not-found.user-role',

  NotFound_Product = 'errors.not-found.product',

  NotFound_Delivery = 'errors.not-found.delivery',

  NotFound_User_Deliveries = 'errors.not-found.user.deliveries',
}
