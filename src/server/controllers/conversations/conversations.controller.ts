import { ProController, transformResponse } from "../../../utils";
import { Request, Response } from "express";
import { controller, httpDelete, httpGet, request, requestParam, response } from "inversify-express-utils";
import { OK } from "http-status-codes";
import { ConversationRepo } from "@app/data/conversation";
import { ModelNotFoundError } from "@random-guys/bucket";

type ControllerResponse = { hello: string } | object;

@controller("/conversations")
export class DocumentsController extends ProController<ControllerResponse> {
  @httpGet("/")
  async getConversations(@request() req: Request, @response() res: Response) {
    const conversations = await ConversationRepo.all({});
    this.handleSuccessCase(OK, req, res, conversations);
  }

  @httpDelete("/:id")
  async deleteAuthorisation(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      await ConversationRepo.destroy({ conversationId: id });
      const response = transformResponse(null, true, "successfully deleted");
      this.handleSuccessCase(OK, req, res, response);
    } catch (error) {
      if (error instanceof ModelNotFoundError) {
        const response = transformResponse(null, false, "conversation does not exist");
        this.handleSuccessCase(OK, req, res, response);
      }
    }
  }
}
