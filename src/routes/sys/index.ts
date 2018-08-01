import * as KoaRouter from 'koa-router';
import KoaValidator from '../../lib/koa-validator';
import sysAlive from './alive';
import echoVotes from './echoVotes';

export default (router: KoaRouter = new KoaRouter()) => {
  router.get('/', ctx => (ctx.body = '/sys'));
  router.get('/alive', sysAlive.handler);
  router.post(
    '/echo-votes',
    KoaValidator(echoVotes.validator),
    echoVotes.handler
  );
  return router;
};
