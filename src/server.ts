import * as Serverless from 'serverless-http';
import * as Koa from 'koa';
import * as KoaBodyParser from 'koa-bodyparser';

import Routes from './routes';

const app = new Koa();
app.use(KoaBodyParser());

Routes(app);

module.exports = { handler: Serverless(app) };
