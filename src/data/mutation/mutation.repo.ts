import { BaseRepository } from "@random-guys/bucket";
import { Mutation } from "./mutation.model";
import mongoose from "mongoose";
import { MutationSchema } from "./mutation.schema";

class MutationRepository extends BaseRepository<Mutation> {
  constructor() {
    super(mongoose.connection, "Mutation", MutationSchema);
  }
}

export const MutationRepo = new MutationRepository();
