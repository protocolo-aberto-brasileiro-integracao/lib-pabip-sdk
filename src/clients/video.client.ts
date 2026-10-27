import axios, { AxiosInstance } from "axios";
import { buildClientHeaders, DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type {
  PabipPeerConnection,
  RecordingsCatalog,
  TraceabilityOptions,
  VideoSession,
  VideoSessionRequest,
} from "./types";

/** `POST /video/playback/{nodeId}/session`, `GET /video/playback/{nodeId}/recordings` and `DELETE /video/playback/session/{sessionId}` against a peer's own PABIP surface. */
export class VideoClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async createSession(
    peer: PabipPeerConnection,
    nodeId: string,
    body: VideoSessionRequest,
    trace?: TraceabilityOptions,
  ): Promise<VideoSession> {
    const response = await this.http.post<VideoSession>(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/${encodeURIComponent(nodeId)}/session`,
      body,
      {
        headers: buildClientHeaders(peer.apiKey, trace),
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
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
      `${trimBaseUrl(peer.baseUrl)}/video/playback/session/${sessionId}`,
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
