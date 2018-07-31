import * as KoaRouter from 'koa-router';
import sysAlive from './alive';

export default (router: KoaRouter = new KoaRouter()) => {
  router.get('/', (ctx) => ctx.body = '/sys');
  router.get('/alive', sysAlive.handler);
  return router;
};