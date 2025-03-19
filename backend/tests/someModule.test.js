import { someFunction } from "../routes/auth.js";

test("should return expected output", () => {
  expect(someFunction("input")).toBe("expected output");
});
