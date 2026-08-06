import axios, { AxiosInstance } from "axios";
import { DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type { PabipPeerConnection, SensorNodeListing } from "./types";

/** `GET /sensor-nodes` / `GET /sensor-nodes/{nodeId}` against a peer's own PABIP surface. */
export class SensorNodesClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async listSensorNodes(
    peer: PabipPeerConnection,
    page: number,
    pageSize: number,
  ): Promise<SensorNodeListing> {
    const response = await this.http.get<SensorNodeListing>(
      `${trimBaseUrl(peer.baseUrl)}/sensor-nodes`,
      {
        headers: { "X-API-Key": peer.apiKey },
        params: { page, pageSize },
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }

  async getSensorNode(
    peer: PabipPeerConnection,
    nodeId: string,
  ): Promise<unknown> {
    const response = await this.http.get(
      `${trimBaseUrl(peer.baseUrl)}/sensor-nodes/${nodeId}`,
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
