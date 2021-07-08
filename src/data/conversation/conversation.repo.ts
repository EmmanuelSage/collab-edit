import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { MutationRepo } from "../mutation";
import { Conversation } from "./conversation.model";
import { ConversationSchema } from "./conversation.schema";

class ConversationRepository extends BaseRepository<Conversation> {
  constructor() {
    super(mongoose.connection, "Conversation", ConversationSchema);
  }

  async getLastMutation(conversationId:string) {
    return await MutationRepo.byID(conversationId);
  }
}

export const ConversationRepo = new ConversationRepository();
