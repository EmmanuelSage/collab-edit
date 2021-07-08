// import Logger from "bunyan";
// import { EventEmitter } from "events";
// import { Request, Response } from "express";
// import { injectable, unmanaged } from "inversify";
import { injectable } from "inversify";

@injectable()
export class SSE<T> {
  // constructor(@unmanaged() private logger: Logger, @unmanaged()) {}

  //  Send a list of `Chunk`(promise of value) using SSE
  // async sendAllChunks(req: Request, res: Response, chunks: Chunk<T>[]) {
  //   sendChunks(this.logger, req, res, chunks);
  // }

  // Proxy events from an event emitter to a client using SSE
  // proxyFrom(req: Request, res: Response, emitter: EventEmitter, eventMap: object) {
  //   return proxy(this.logger, req, res, emitter, eventMap);
  // }

  //  Handles operation success and sends a HTTP response.
  async handleSuccessCase(code, req, res, data: T) {
    // this.logger.info({ req, res });
    res.status(code).json(data);
  }
}
