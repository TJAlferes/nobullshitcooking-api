export class StatusError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}