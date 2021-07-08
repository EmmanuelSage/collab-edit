import { SchemaFactory, trimmedString } from "@random-guys/bucket";
import { SchemaTypes } from "mongoose";

export const ConversationSchema = SchemaFactory({
  conversationId: { ...trimmedString, required: true, index: { unique: true, background: false } },
  text: {
    type: SchemaTypes.String
  },
  lastMutation: { ...trimmedString, required: true }
});
