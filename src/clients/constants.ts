import { randomUUID } from "node:crypto";
import type { TraceabilityOptions } from "./types";

/** Per-call HTTP timeout for every client in this package. */
export const DEFAULT_CLIENT_TIMEOUT_MS = 10_000;

export const HEADER_REQUEST_ID = "X-Request-Id";
export const HEADER_ACTOR_ID = "X-Actor-Id";
export const HEADER_CASE_REF = "X-Case-Ref";

/** Correlation id for a request when the caller did not supply one. */
export function generateRequestId(): string {
  return randomUUID();
}

/**
 * `X-API-Key` plus traceability headers. `X-Request-Id` is always sent — the
 * caller's value is reused, otherwise one is generated so every call is traceable.
 */
export function buildClientHeaders(
  apiKey: string,
  trace?: TraceabilityOptions,
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-API-Key": apiKey,
    [HEADER_REQUEST_ID]: trace?.requestId ?? generateRequestId(),
  };
  if (trace?.actorId) headers[HEADER_ACTOR_ID] = trace.actorId;
  if (trace?.caseRef) headers[HEADER_CASE_REF] = trace.caseRef;
  return headers;
}
