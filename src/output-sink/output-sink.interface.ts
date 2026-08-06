export interface DeliveryEvent {
  eventId: string;
  eventTime: string;
  sensorNodeId: string;
  partnerName: string;
  latitude: number;
  longitude: number;
  evidenceUrl: string;
  data: Record<string, unknown>;
}

export interface DeliveryBatch {
  batchId: string;
  batchTime: string;
  batchCount: number;
  batchType: string;
  events: DeliveryEvent[];
}

/**
 * Contract every output-sink driver implements — one `deliver` call per
 * batch, never per individual event.
 */
export interface OutputSinkDriver {
  deliver(
    batch: DeliveryBatch,
    peerId: string,
    batchType: string,
  ): Promise<void>;
}
