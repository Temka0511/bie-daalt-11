export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Email already registered: ${email}`);
    this.name = 'DuplicateEmailError';
  }
}

export class InvalidQueryError extends Error {
  constructor(reason: string) {
    super(`Invalid search query: ${reason}`);
    this.name = 'InvalidQueryError';
  }
}

export class UserAlreadyActiveError extends Error {
  constructor(id: string) {
    super(`User is already active: ${id}`);
    this.name = 'UserAlreadyActiveError';
  }
}
