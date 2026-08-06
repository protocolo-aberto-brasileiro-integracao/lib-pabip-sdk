import axios, { AxiosInstance } from "axios";
import { DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type { PabipPeerConnection } from "./types";

/** `GET /image-analytics/{eventId}` against a peer's own PABIP surface. */
export class ImageAnalyticsClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async getEvent(peer: PabipPeerConnection, eventId: string): Promise<unknown> {
    const response = await this.http.get(
      `${trimBaseUrl(peer.baseUrl)}/image-analytics/${eventId}`,
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
