import { Model } from "@random-guys/bucket";

export const type = <const>["insert", "delete"];
export type Type = typeof type[number];

export const author = <const>["alice", "bob"];
export type Author = typeof author[number];

export interface Origin {
  bob: number;
  alice: number;
}

export interface Data {
  index: number;
  length: number;
  text: string;
  type: Type;
}

export interface MutationDTO {
  author: Author;
  conversationId: string;
  data: Data;
  origin: Origin;
}

export interface Mutation extends Model {
  author: Author;
  conversationId: string;
  data: Data;
  origin: Origin;
}
