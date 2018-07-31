import * as Serverless from 'serverless-http';
import * as Koa from 'koa';

import Routes from './routes';

const app = new Koa();

Routes(app);

module.exports = { handler: Serverless(app) };
