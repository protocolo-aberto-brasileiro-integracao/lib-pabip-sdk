import axios, { AxiosInstance } from "axios";
import { buildClientHeaders, DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type { PabipPeerConnection, TraceabilityOptions } from "./types";

/** `GET /image-analytics/{eventId}` against a peer's own PABIP surface. */
export class ImageAnalyticsClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async getEvent(
    peer: PabipPeerConnection,
    eventId: string,
    trace?: TraceabilityOptions,
  ): Promise<unknown> {
    const response = await this.http.get(
      `${trimBaseUrl(peer.baseUrl)}/image-analytics/${encodeURIComponent(eventId)}`,
      {
        headers: buildClientHeaders(peer.apiKey, trace),
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }
}

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}
