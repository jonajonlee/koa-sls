import { Context } from 'koa';
import sysAlive from '../../actions/sys/alive';

export default {
  handler: async (ctx: Context) => {
    ctx.body = await sysAlive();
  }
};
