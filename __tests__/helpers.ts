import { SuperTest, Test } from "supertest";
import { CREATED } from "http-status-codes";
import { dto1, dto10, dto2, dto3, dto4, dto5, dto6, dto7, dto8, dto9 } from "./data";

export async function getResponse<T = any>(test: Test): Promise<T> {
  const response = await test;
  return response.body as T;
}

export async function getError(test: Test): Promise<string> {
  const response = await test;
  return response.body.message;
}

export async function prettyPrint(data: any) {
  console.log(JSON.stringify(data, null, 2));
}

export async function runOnlyBobTest(request: SuperTest<Test>) {
  await getResponse(request.post("/mutations").send(dto1).expect(CREATED));
  await getResponse(request.post("/mutations").send(dto2).expect(CREATED));
  await getResponse(request.post("/mutations").send(dto3).expect(CREATED));
  const lastResult = await getResponse(request.post("/mutations").send(dto4).expect(CREATED));
  return lastResult;
}

export async function runInsertandDeleteBobTest(request: SuperTest<Test>) {
  await getResponse(request.post("/mutations").send(dto5).expect(CREATED));
  const lastResult = await getResponse(request.post("/mutations").send(dto6).expect(CREATED));
  return lastResult;
}

export async function runBobAndAliceNoConflictTest(request: SuperTest<Test>) {
  await getResponse(request.post("/mutations").send(dto7).expect(CREATED));
  const lastResult = await getResponse(request.post("/mutations").send(dto8).expect(CREATED));
  return lastResult;
}

export async function runBobAndAlicewithConflictTest(request: SuperTest<Test>) {
  await getResponse(request.post("/mutations").send(dto9).expect(CREATED));
  const lastResult = await getResponse(request.post("/mutations").send(dto10).expect(CREATED));
  return lastResult;
}
