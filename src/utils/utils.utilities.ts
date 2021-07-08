import { Mutation, MutationDTO } from "@app/data/mutation";

export const compareOrigin = (previousMutation: Mutation, body: MutationDTO) => {
  return previousMutation.origin.bob === body.origin.bob && previousMutation.origin.alice === body.origin.alice;
};

export const transformMutation = (PreviousMutation: Mutation, newMutation: MutationDTO): MutationDTO => {
  const currentMutation = { ...newMutation };
  if (currentMutation.author === "alice") {
    currentMutation.origin.alice += 1;
  } else {
    currentMutation.origin.bob += 1;
  }
  if (currentMutation.data.type === "insert" && PreviousMutation.data.type === "insert") {
    currentMutation.data.index = currentMutation.data.index + PreviousMutation.data.text.length + 1;
  }
  return currentMutation;
};

export const remove = (text: string, from: number, to: number) => {
  return text.substring(0, from) + text.slice(to + from);
};

export const getSameOriginText = (body, conversation) => {
  return body.data.type === "insert"
    ? `${conversation.text.slice(0, body.data.index)}${body.data.text.length > 1 ? " " : ""}${
        body.data.text
      }${conversation.text.slice(body.data.index)}`
    : remove(conversation.text, body.data.index, body.data.length);
};

export const getDifferentOriginText = (body, conversation) => {
  return body.data.type === "insert"
    ? `${conversation.text.slice(0, body.data.index)}${body.data.text.length > 1 ? " " : ""}${
        body.data.text
      }${conversation.text.slice(body.data.index)}`
    : remove(conversation.text, body.data.index, body.data.length).trim();
};

export const transformResponse = (text: string | null, ok: boolean = true, msg?: string) => {
  const defaultResponse: ControllerResponse = {
    msg: msg || "Operation was successfull",
    ok
  };

  if (text) {
    defaultResponse.text = text;
  }

  return defaultResponse;
};

export interface ControllerResponse {
  msg: string;
  ok: boolean;
  text?: string;
}
