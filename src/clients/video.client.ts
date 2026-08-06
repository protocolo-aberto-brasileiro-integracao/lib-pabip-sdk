import axios, { AxiosInstance } from "axios";
import { DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type {
  PabipPeerConnection,
  RecordingsCatalog,
  VideoSession,
  VideoSessionRequest,
} from "./types";

/** `POST /video/playback/{nodeId}/session` and `GET /video/playback/{nodeId}/recordings` against a peer's own PABIP surface. */
export class VideoClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async createSession(
    peer: PabipPeerConnection,
    nodeId: string,
    body: VideoSessionRequest,
  ): Promise<VideoSession> {
    const response = await this.http.post<VideoSession>(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/${nodeId}/session`,
      body,
      {
        headers: { "X-API-Key": peer.apiKey },
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }

  async getRecordings(
    peer: PabipPeerConnection,
    nodeId: string,
  ): Promise<RecordingsCatalog> {
    const response = await this.http.get<RecordingsCatalog>(
      `${trimBaseUrl(peer.baseUrl)}/video/playback/${nodeId}/recordings`,
      {
        headers: { "X-API-Key": peer.apiKey },
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }
}

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}
