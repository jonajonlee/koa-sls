import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import SysRouter from './sys';

const sysRouter = SysRouter();

const mainRouter = new KoaRouter();

// Add any nested routes here
mainRouter.get('/', ctx => (ctx.body = 'Main Page: "/"'));
mainRouter.use('/sys', sysRouter.routes(), sysRouter.allowedMethods());

export default (app: Koa, router: KoaRouter = mainRouter) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
