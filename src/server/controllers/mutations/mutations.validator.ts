import joi from "@hapi/joi";
import { isOptionalString, isRequiredString } from "../../../utils";

export const isOrigin = joi.object({
  alice: joi.number(),
  bob: joi.number()
});

export const isData = joi.object({
  index: joi.number(),
  length: joi.number().allow(null),
  text: isOptionalString,
  type: isRequiredString.valid("insert", "delete")
});

export const isMutation = joi.object({
  author: isRequiredString.valid("alice", "bob"),
  conversationId: isRequiredString,
  data: isData,
  origin: isOrigin
});
