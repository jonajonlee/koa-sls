import KoaValidatorSchema from './types/KoaValidatorSchema';
import { Context } from 'koa';

import * as R from 'ramda';
import * as Joi from 'joi';
import KoaValidatorMissingSchemaError from './errors/KoaValidatorMissingSchemaError';

/**
 * Returns a map of all values for each key in the schema by using
 * the path property to traverse through the context
 */
const getValues = (schema: KoaValidatorSchema, ctx: Context) =>
  objectMap(opt => R.path(opt.path), schema);

/**
 * Returns a map of all validators for each key in the schema
 */
const getValidators = (schema: KoaValidatorSchema) =>
  objectMap(opt => opt.validator, schema);

/**
 * Returns a map of all sanitizer for each key in the schema
 */
const getSanitizers = (schema: KoaValidatorSchema) =>
  objectMap(opt => opt.sanitizer, schema);

/**
 * Retrieves the values from the context and sanitizes/validates
 * them before returning the object in the context.state.params
 * If the context is invalid, a 400 route response is thrown
 */
const validateCtx = (schema: KoaValidatorSchema) => (
  ctx: Context,
  next: Function
) => {
  if (R.isNil(schema) || R.isEmpty(schema)) {
    throw new KoaValidatorMissingSchemaError();
  }

  const values = getValues(schema, ctx);
  const validator = getValidators(schema);
  const sanitizers = getSanitizers(schema);
  const sanitized = R.evolve(sanitizers, values);
  const validated = Joi.validate(sanitized, validator, { abortEarly: false });

  if (validated.error) {
    ctx.status = 400;
    ctx.body = validated.error.details;
  } else {
    ctx.state.params = validated.value;
    next();
  }
};

export default validateCtx;
