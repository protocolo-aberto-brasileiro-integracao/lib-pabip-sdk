import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  buildClientHeaders,
  DEFAULT_CLIENT_TIMEOUT_MS,
  generateRequestId,
  HEADER_REQUEST_ID,
} from "./constants";
import type {
  PabipPeerConnection,
  RecordingsCatalog,
  TraceabilityOptions,
  VideoSession,
  VideoSessionRequest,
  VideoSessionResult,
} from "./types";

/** `POST /video/playback/{nodeId}/session`, `GET /video/playback/{nodeId}/recordings` and `DELETE /video/playback/session/{sessionId}` against a peer's own PABIP surface. */
export class VideoClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async createSession(
    peer: PabipPeerConnection,
    nodeId: string,
    body: VideoSessionRequest,
    trace?: TraceabilityOptions,
  ): Promise<VideoSessionResult> {
    const requestId = trace?.requestId ?? generateRequestId();
    const response = await this.http.post<VideoSession>(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/${encodeURIComponent(nodeId)}/session`,
      body,
      {
        headers: buildClientHeaders(peer.apiKey, { ...trace, requestId }),
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return {
      ...response.data,
      requestId: readResponseRequestId(response) ?? requestId,
    };
  }

  async getRecordings(
    peer: PabipPeerConnection,
    nodeId: string,
    trace?: TraceabilityOptions,
  ): Promise<RecordingsCatalog> {
    const response = await this.http.get<RecordingsCatalog>(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/${encodeURIComponent(nodeId)}/recordings`,
      {
        headers: buildClientHeaders(peer.apiKey, trace),
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }

  async deleteSession(
    peer: PabipPeerConnection,
    sessionId: string,
    trace?: TraceabilityOptions,
  ): Promise<void> {
    await this.http.delete(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/session/${encodeURIComponent(sessionId)}`,
      {
        headers: buildClientHeaders(peer.apiKey, trace),
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
  }
}

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function readResponseRequestId(
  response: AxiosResponse<VideoSession & { requestId?: string }>,
): string | undefined {
  const fromHeader: unknown =
    response.headers?.[HEADER_REQUEST_ID.toLowerCase()];
  if (typeof fromHeader === "string" && fromHeader) return fromHeader;
  const fromBody = response.data?.requestId;
  if (typeof fromBody === "string" && fromBody) return fromBody;
  return undefined;
}
