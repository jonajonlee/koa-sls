export default class KoaValidatorMissingSchemaError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'KoaValidatorMissingSchemaError';
  }
}
