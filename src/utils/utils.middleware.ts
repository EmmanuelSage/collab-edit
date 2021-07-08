import { Log } from "@app/common/services";
import { DuplicateModelError, ModelNotFoundError } from "@random-guys/bucket";
import { composeE, ConflictError, ControllerError, NotFoundError } from "@random-guys/siber";
import Logger from "bunyan";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

export type Interpreter = (error: Error) => ControllerError | null;

export function universalErrorHandler(logger: Logger, interpreter?: Interpreter): ErrorRequestHandler {
  // useful when we have call an asynchrous function that might throw
  // after we've sent a response to client
  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);

    if (interpreter && !(err instanceof ControllerError)) {
      err = interpreter(err) || err;
    }

    // exit early when we don't understand it
    if (!(err instanceof ControllerError)) {
      logger.error({ err, res, req });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error", ok: false });
    }

    res.status(err.code).json({ msg: err["data"] || err.message, ok: false });
    logger.error({ err, res, req });
  };
}

/**
 * Interpret errors for bucket
 * @param err error to interpret
 */
export function processBucketError(err: Error) {
  if (err instanceof DuplicateModelError) {
    return new ConflictError(err.message);
  } else if (err instanceof ModelNotFoundError) {
    return new NotFoundError(err.message);
  }
  return null;
}

export const errors = universalErrorHandler(Log, composeE(processBucketError));
