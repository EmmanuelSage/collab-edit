import joi from "@hapi/joi";
import { MongoConfig } from "@random-guys/bucket";
import { AppConfig, autoloadEnv, mongoConfig, siberConfig } from "@random-guys/siber";

const env = autoloadEnv<ProServiceConfig>(
  siberConfig({
    ...mongoConfig,
    api_version: joi.string().default(""),
    client_domain: joi.string().required()
  })
);

export interface ProServiceConfig extends AppConfig, MongoConfig {
  client_domain: string;
  api_version: string;
}

export default env;
