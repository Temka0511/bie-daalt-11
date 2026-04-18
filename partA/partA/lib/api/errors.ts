export class InvalidKeyError extends Error {
  constructor() {
    super('Cache key must not be empty');
    this.name = 'InvalidKeyError';
  }
}

export class InvalidCapacityError extends Error {
  constructor(capacity: number) {
    super(`Cache capacity must be at least 1, got: ${capacity}`);
    this.name = 'InvalidCapacityError';
  }
}
