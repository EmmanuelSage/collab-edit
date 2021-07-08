import { Model } from "@random-guys/bucket";

export interface Conversation extends Model {
  conversationId: string;
  text: string;
  lastMutation: string
}
