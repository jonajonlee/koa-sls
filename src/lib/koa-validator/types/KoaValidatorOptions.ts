import { JoiObject as Joi } from 'joi';

export type KoaValidatorSanitizer = (x: any) => any;

export default interface KoaValidatorOptions {
  path: string[];
  sanitizer: KoaValidatorSanitizer;
  validator: Joi;
}
