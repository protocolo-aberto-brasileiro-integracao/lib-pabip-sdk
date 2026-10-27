export const PROBLEM_TYPES = [
  "session-client-mismatch",
  "session-not-found",
] as const;
export type ProblemType = (typeof PROBLEM_TYPES)[number];

/** RFC 7807 problem document as emitted by a PABIP peer. `type` is the base URL joined with a {@link ProblemType} slug. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}
