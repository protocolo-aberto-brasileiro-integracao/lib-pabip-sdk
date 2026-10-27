import type { TraceabilityOptions } from "./types";

/** Per-call HTTP timeout for every client in this package. */
export const DEFAULT_CLIENT_TIMEOUT_MS = 10_000;

export const HEADER_REQUEST_ID = "X-Request-Id";
export const HEADER_ACTOR_ID = "X-Actor-Id";
export const HEADER_CASE_REF = "X-Case-Ref";

/** `X-API-Key` plus any traceability headers that were actually provided. */
export function buildClientHeaders(
  apiKey: string,
  trace?: TraceabilityOptions,
): Record<string, string> {
  const headers: Record<string, string> = { "X-API-Key": apiKey };
  if (trace?.requestId) headers[HEADER_REQUEST_ID] = trace.requestId;
  if (trace?.actorId) headers[HEADER_ACTOR_ID] = trace.actorId;
  if (trace?.caseRef) headers[HEADER_CASE_REF] = trace.caseRef;
  return headers;
}
