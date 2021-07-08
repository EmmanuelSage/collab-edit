import { SchemaFactory, trimmedString, trimmedLowercaseString } from "@random-guys/bucket";
import { SchemaDefinition, SchemaTypes } from "mongoose";
import { author, type } from "./mutation.model";

const Data: SchemaDefinition = {
  index:  { type: SchemaTypes.Number, default: false },
  length:  { type: SchemaTypes.Number, default: false },
  text: { ...trimmedString},
  type:  {
    ...trimmedLowercaseString,
    enum: type,
    required: true
  }
};

const Origin: SchemaDefinition = {
  bob:  { type: SchemaTypes.Number, default: false },
  alice:  { type: SchemaTypes.Number, default: false },
};

export const MutationSchema = SchemaFactory({
  author: { ...trimmedLowercaseString, index: true, enum: author, required: true },
  conversationId: { ...trimmedString, required: true},
  data: Data,
  origin: Origin
});
