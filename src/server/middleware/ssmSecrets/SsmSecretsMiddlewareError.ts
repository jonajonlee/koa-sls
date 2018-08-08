export default class SsmSecretsMiddlewareError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SsmSecretsMiddlewareError';
  }
}