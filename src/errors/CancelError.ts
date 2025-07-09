export class CancelError extends Error {
  public readonly code: string;
  constructor(message: string) {
    super(message);
    this.name = 'CancelError';
    this.code = 'CANCEL_ERROR';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}