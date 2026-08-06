import type {
  DeliveryBatch,
  DeliveryEvent,
  OutputSinkDriver,
} from "./output-sink.interface";

describe("OutputSinkDriver contract", () => {
  it("accepts a driver whose deliver() receives a well-formed DeliveryBatch", async () => {
    const received: DeliveryBatch[] = [];
    const driver: OutputSinkDriver = {
      deliver: (batch) => {
        received.push(batch);
        return Promise.resolve();
      },
    };

    const event: DeliveryEvent = {
      eventId: "event-1",
      eventTime: "2026-08-06T12:00:00.000Z",
      sensorNodeId: "node-1",
      partnerName: "Acme",
      latitude: -23.55,
      longitude: -46.63,
      evidenceUrl: "https://cdn.example.test/e/event-1.jpg",
      data: { plate: "ABC1234" },
    };
    const batch: DeliveryBatch = {
      batchId: "batch-1",
      batchTime: "2026-08-06T12:00:00.000Z",
      batchCount: 1,
      batchType: "plate",
      events: [event],
    };

    await driver.deliver(batch, "peer-1", "plate");

    expect(received).toEqual([batch]);
  });
});
