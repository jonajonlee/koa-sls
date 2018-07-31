import { Context } from 'koa';
import * as Joi from 'joi';
import echoVotes from '../../actions/sys/echoVotes';
import KoaValidatorSchema from '../../lib/koa-validator/types/KoaValidatorSchema';

export default {
  validator: {
    cats: {
      path: ['request', 'body', 'cats'],
      sanitizer: x => parseInt(x, 10),
      validator: Joi.number().required()
    },
    dogs: {
      path: ['request', 'body', 'dogs'],
      sanitizer: x => parseInt(x, 10),
      validator: Joi.number().required()
    }
  } as KoaValidatorSchema,

  handler: async (ctx: Context) => {
    ctx.body = await echoVotes(ctx.state.params);
  }
};
