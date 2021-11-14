export enum ErrorType {
  Unauthorized = 'Unauthorized',
  NotFound = 'NotFound',
  Server = 'Server',
  Client = 'Client',
}

/** Pass any error. If the error is an AtomicError and it's Unauthorized, return true */
export function isUnauthorized(error: Error): boolean {
  if (error instanceof AtomicError) {
    if (error.type == ErrorType.Unauthorized) {
      return true;
    }
  }
  return false;
}

/**
 * Atomic Data Errors have an additional Type, which tells the client what kind
 * of error to render.
 */
export class AtomicError extends Error {
  type: ErrorType;

  constructor(message, type = ErrorType.Client) {
    super(message);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, AtomicError.prototype);
    this.type = type;
  }
}
