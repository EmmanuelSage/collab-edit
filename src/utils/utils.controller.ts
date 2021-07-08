import { Log } from "@app/common/services";
import { injectable } from "inversify";

/**
 * Controller setup, easily extendible
 */
@injectable()
export class ProController<T> {
//  Handles operation success and sends a HTTP response.
  async handleSuccessCase(code, req, res, data: T) {
    Log.info({ req, res });
    res.status(code).json(data);
  }
}
