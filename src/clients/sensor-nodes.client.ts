import axios, { AxiosInstance } from "axios";
import { buildClientHeaders, DEFAULT_CLIENT_TIMEOUT_MS } from "./constants";
import type {
  PabipPeerConnection,
  SensorNodeListing,
  TraceabilityOptions,
} from "./types";

/** `GET /sensor-nodes` / `GET /sensor-nodes/{nodeId}` against a peer's own PABIP surface. */
export class SensorNodesClient {
  constructor(private readonly http: AxiosInstance = axios.create()) {}

  async listSensorNodes(
    peer: PabipPeerConnection,
    page: number,
    pageSize: number,
    trace?: TraceabilityOptions,
  ): Promise<SensorNodeListing> {
    const response = await this.http.get<SensorNodeListing>(
      `${trimBaseUrl(peer.baseUrl)}/sensor-nodes`,
      {
        headers: buildClientHeaders(peer.apiKey, trace),
        params: { page, pageSize },
        timeout: DEFAULT_CLIENT_TIMEOUT_MS,
      },
    );
    return response.data;
  }

  async getSensorNode(
    peer: PabipPeerConnection,
    nodeId: string,
    trace?: TraceabilityOptions,
  ): Promise<unknown> {
    const response = await this.http.get(
      `${trimBaseUrl(peer.baseUrl)}/sensor-nodes/${nodeId}`,
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
