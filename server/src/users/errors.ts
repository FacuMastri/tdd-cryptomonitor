export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidUserOrPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserOrPasswordError';
  }
}
