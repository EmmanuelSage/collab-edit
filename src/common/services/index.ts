import env from "@app/common/config/env";
import { createRequestSerializer, errSerializer, resSerializer } from "@random-guys/siber";
import Logger, { createLogger } from "bunyan";

export const Log: Logger = createLogger({
  name: env.service_name,
  serializers: {
    err: errSerializer,
    res: resSerializer,
    req: createRequestSerializer()
  }
});

