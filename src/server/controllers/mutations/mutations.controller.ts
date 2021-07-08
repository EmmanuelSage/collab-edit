import { Request, Response } from "express";
import { controller, httpPost, request, requestBody, response } from "inversify-express-utils";
import { isMutation } from "./mutations.validator";
import { validate } from "@random-guys/siber";
import { MutationRepo, MutationDTO, Mutation } from "@app/data/mutation";
import { ModelNotFoundError } from "@random-guys/bucket";
import { Conversation, ConversationRepo } from "@app/data/conversation";
import { Log } from "@app/common/services";
import { compareOrigin, getDifferentOriginText, getSameOriginText, ProController, transformMutation, transformResponse } from "../../../utils";

type ControllerResponse = { hello: string } | object;

@controller("/mutations")
export class MutationsController extends ProController<ControllerResponse> {
  @httpPost("/", validate(isMutation))
  async createMutation(@request() req: Request, @response() res: Response, @requestBody() body: MutationDTO) {
    let conversation: Conversation;
    let previousMutation: Mutation;
    let currentMutation: Mutation;

    try {
      conversation = await ConversationRepo.byQuery({ conversationId: body.conversationId });
    } catch (error) {
      if (error instanceof ModelNotFoundError) {
        currentMutation = await MutationRepo.create(body);
        conversation = await ConversationRepo.create({
          conversationId: body.conversationId,
          lastMutation: currentMutation.id,
          text: currentMutation.data.text
        });

        const response = transformResponse(conversation.text);
        return this.handleSuccessCase(201, req, res, response);
      }
    }

    try {
      previousMutation = await MutationRepo.byID(conversation.lastMutation);
      const isSameOrigin = compareOrigin(previousMutation, body);
      
      if (isSameOrigin) {
        const newMutation = transformMutation(previousMutation, body);
        currentMutation = await MutationRepo.create(newMutation);

        const newConvoText = getSameOriginText(body, conversation);
        const newConversation: Conversation = await ConversationRepo.update(
          { conversationId: body.conversationId },
          { lastMutation: currentMutation.id, text: newConvoText }
        );

        const response = transformResponse(newConversation.text);
        return this.handleSuccessCase(201, req, res, response);
      }

      currentMutation = await MutationRepo.create(body);
      const newConvoText = getDifferentOriginText(body, conversation);

      const newConversation: Conversation = await ConversationRepo.update(
        { conversationId: body.conversationId },
        { lastMutation: currentMutation.id, text: newConvoText }
      );
      const response = transformResponse(newConversation.text);
      this.handleSuccessCase(201, req, res, response);
    } catch (error) {
      Log.error(error);
    }
  }
}
