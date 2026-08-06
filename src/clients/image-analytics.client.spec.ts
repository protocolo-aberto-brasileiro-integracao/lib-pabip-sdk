import nock from "nock";
import { ImageAnalyticsClient } from "./image-analytics.client";
import type { PabipPeerConnection } from "./types";

describe("ImageAnalyticsClient", () => {
  const peer: PabipPeerConnection = {
    baseUrl: "https://acme.example.test",
    apiKey: "their-secret-key",
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it("gets an analytics event by id", async () => {
    const scope = nock("https://acme.example.test")
      .get("/image-analytics/event-1")
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(200, { eventId: "event-1", data: { plate: "ABC1234" } });

    const client = new ImageAnalyticsClient();
    const result = await client.getEvent(peer, "event-1");

    expect(result).toEqual({ eventId: "event-1", data: { plate: "ABC1234" } });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects when the event does not exist on the peer", async () => {
    nock("https://acme.example.test")
      .get("/image-analytics/missing")
      .reply(404);

    const client = new ImageAnalyticsClient();

    await expect(client.getEvent(peer, "missing")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
