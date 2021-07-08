import "reflect-metadata";
import { CREATED, OK } from "http-status-codes";
import supertest, { SuperTest, Test } from "supertest";

import { App } from "../src/server/app";
import {
  getResponse,
  runBobAndAliceNoConflictTest,
  runBobAndAlicewithConflictTest,
  runInsertandDeleteBobTest,
  runOnlyBobTest
} from "./helpers";
import { dto1 } from "./data";

let app: App;
let request: SuperTest<Test>;

beforeAll(async () => {
  app = new App();
  await app.connectDB();

  const server = app.getServer().build();
  request = supertest(server);
});

afterAll(async () => {
  await app.db.dropDatabase();
  await app.closeDB();
});

afterEach(async () => {
  await app.db.dropDatabase();
});

describe("Mutations", () => {
  it("Runs Mutations as described", async () => {
    await runOnlyBobTest(request);
    await runInsertandDeleteBobTest(request);
    await runBobAndAliceNoConflictTest(request);

    const res = await runBobAndAlicewithConflictTest(request);
    expect(res.text).toBe("The big house is green and yellow");
  });
});

describe("Conversatoins", () => {
  it("Runs Mutations as described", async () => {
    await runOnlyBobTest(request);
    await runInsertandDeleteBobTest(request);
    await runBobAndAliceNoConflictTest(request);

    const res = await runBobAndAlicewithConflictTest(request);
    expect(res.text).toBe("The big house is green and yellow");
  });

  it("should get conversations", async () => {
    await getResponse(
      request
        .post("/mutations")
        .send({ ...dto1, conversationId: "005" })
        .expect(CREATED)
    );

    const res = await getResponse(request.get("/conversations").expect(OK));
    expect(res.length).toBeGreaterThan(0);
  });

  it("should delete a conversation", async () => {
    const conversationId = "009";
    await getResponse(
      request
        .post("/mutations")
        .send({ ...dto1, conversationId })
        .expect(CREATED)
    );
    const conversations = await getResponse(request.get("/conversations").expect(OK));
    const res = await getResponse(
      request.delete(`/conversations/${conversations[0].conversationId}`).expect(OK)
    );
     expect(res.msg).toBe("successfully deleted");
     expect(res.ok).toBe(true)

  });
});
