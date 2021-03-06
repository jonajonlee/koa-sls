import { SSM } from 'aws-sdk';
import { Context } from 'koa';
import objectMap from '../../../util/objectMap';
import SsmSecretsMiddlewareError from './SsmSecretsMiddlewareError';

type Secrets = Record<string, string>;

export const SECRETS: Secrets = {
  MYSQL_DATABASE: '/base-koa-sls/dev/mysql_database',
  MYSQL_HOST: '/base-koa-sls/dev/mysql_hostasdfsadf',
  MYSQL_PASSWORD: '/base-koa-sls/dev/mysql_password',
  MYSQL_PORT: '/base-koa-sls/dev/mysql_port',
  MYSQL_USERNAME: '/base-koa-sls/dev/mysql_username'
};

interface IConfig {
  prefix?: string;
  secrets?: Secrets;
  ssm?: SSM;
}

/**
 * Koa Middleware to get secrets from SSM Parameter Store and
 * inject them into the Koa Context
 */
export default class SsmSecretsMiddleware {
  prefix: string = '';
  secrets: Secrets = SECRETS;
  ssm: SSM;

  constructor(config?: IConfig) {
    this.ssm = (config && config.ssm) || new SSM();

    if (config) {
      if (config.prefix) {
        this.prefix = config.prefix;
      }

      if (config.secrets) {
        this.secrets = config.secrets;
      }
    }
  }

  /**
   * Gets the parameter SSM names from the secrets configuration
   */
  getParamNames = (secrets: Secrets) =>
    Object.keys(secrets).map(key => this.prefix + secrets[key]);

  /**
   * Converts a response from SSM Parameter request to a map of
   * parameter's name and value pairs
   */
  ssmResultToValueMap = (ssmResult: SSM.GetParametersResult) => {
    if (!ssmResult.Parameters) {
      return {};
    }

    return ssmResult.Parameters.reduce(
      (obj, param) =>
        param.Name && param.Value ? { ...obj, [param.Name]: param.Value } : obj,
      {}
    ) as Record<string, string>;
  };

  /**
   * Returns a map of the secret values in the configuration by pulling
   * the values out fo the SSM parameter result
   */
  extractSecrets = (ssmResult: SSM.GetParametersResult) => {
    if (!ssmResult.Parameters) {
      return {};
    }

    const ssmParamMap = this.ssmResultToValueMap(ssmResult);

    return objectMap(secret => ssmParamMap[secret], this.secrets);
  };

  hasMissingSecret = (secrets: Secrets) => {
    Object.keys(secrets).forEach(key => {
      if (!secrets[key]) {
        return false;
      }
    });

    return true;
  };

  /**
   * A Koa Middleware function to extract properties from SSM Parameter Store
   * and inject them into the ctx state
   * @param ctx
   * @param next
   */
  middleware(ctx: Context, next: Function) {
    const opts = {
      Names: this.getParamNames(this.secrets),
      WithDecryption: true
    };

    return this.ssm
      .getParameters(opts)
      .promise()
      .then(this.extractSecrets)
      .then(secrets => {
        if (this.hasMissingSecret(secrets)) {
          throw new SsmSecretsMiddlewareError('Missing SSM Secrets');
        }
        return secrets;
      })
      .then(secrets => {
        ctx.state.secrets = secrets;
        next();
      })
      .catch(e => {
        // TODO: send rollbar error here
        console.error(e);
        ctx.status = 500;
        ctx.body = 'Unable to get secrets';
      });
  }
}
