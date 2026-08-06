export interface PabipPeerConnection {
  baseUrl: string;
  apiKey: string;
}

/** Mirrors the PABIP spec's `GET /sensor-nodes` envelope 1:1. */
export interface SensorNodeListing {
  items: unknown[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Mirrors the PABIP spec's `POST /video/playback/{id}/session` response 1:1. */
export interface VideoSession {
  streamUrl: string;
  expiresIn: number;
}

/** Mirrors the PABIP spec's `POST /video/playback/{id}/session` request body 1:1. */
export interface VideoSessionRequest {
  startDate?: string;
  endDate?: string;
}

/** Mirrors the PABIP spec's `GET /video/playback/{id}/recordings` response 1:1. */
export interface RecordingsCatalog {
  firstClipDate: string;
  lastClipDate: string;
  discontinuities: Array<{ start: string; finish: string }>;
}
