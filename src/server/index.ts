import * as Serverless from 'serverless-http';
import * as Koa from 'koa';
import * as KoaBodyParser from 'koa-bodyparser';
import SsmSecretsMiddleware from './middleware/ssmSecrets';

import Routes from '../routes';

const ssmSecretsMiddleware = new SsmSecretsMiddleware();

const app = new Koa();
app.use(KoaBodyParser());
app.use(ssmSecretsMiddleware.middleware.bind(ssmSecretsMiddleware));

app.use((ctx, next) => {
  console.log('debugA1', ctx.state);
  next();
});

Routes(app);

module.exports = { handler: Serverless(app) };
