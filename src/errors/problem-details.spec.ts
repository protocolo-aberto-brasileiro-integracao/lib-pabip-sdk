import { PROBLEM_TYPES } from "./problem-details";

describe("PROBLEM_TYPES", () => {
  it("exposes the session error slugs defined by the PABIP spec", () => {
    expect(PROBLEM_TYPES).toContain("session-client-mismatch");
    expect(PROBLEM_TYPES).toContain("session-not-found");
  });
});
