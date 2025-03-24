import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_CONNECTION_STRING: string;
  LD_LIBRARY_PATH: string;

  PORCENTAJE_IVA: number;
  PAGOS_API_URL: string;
  PAGOS_API_TOKEN_TS: string;
  PAGOS_API_TOKEN_SS: string;
  PAGOS_API_TOKEN_CS: string;
}

const envsSchema = joi
  .object({
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_CONNECTION_STRING: joi.string().required(),
    LD_LIBRARY_PATH: joi.string().default('C:/ORACLE/instantclient_12_1'),

    PORCENTAJE_IVA: joi.number().default(0.15),

    PAGOS_API_URL: joi.string().required(),
    PAGOS_API_TOKEN_TS: joi.string().required(),
    PAGOS_API_TOKEN_SS: joi.string().required(),
    PAGOS_API_TOKEN_CS: joi.string().required(),
  })
  .unknown()
  .required();

const validationSchema = envsSchema.validate(process.env);

if (validationSchema.error) {
  throw new Error(`Config validation error: ${validationSchema.error.message}`);
}

const envVars: EnvVars = validationSchema.value as EnvVars;

export const envs = {
  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_CONNECTION_STRING: envVars.DB_CONNECTION_STRING,
  LD_LIBRARY_PATH: envVars.LD_LIBRARY_PATH,

  PORCENTAJE_IVA: envVars.PORCENTAJE_IVA,

  PAGOS_API_URL: envVars.PAGOS_API_URL,
  PAGOS_API_TOKEN_TS: envVars.PAGOS_API_TOKEN_SS,
  PAGOS_API_TOKEN_SS: envVars.PAGOS_API_TOKEN_SS,
  PAGOS_API_TOKEN_CS: envVars.PAGOS_API_TOKEN_CS,
};
