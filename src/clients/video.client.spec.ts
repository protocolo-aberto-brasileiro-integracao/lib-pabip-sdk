import nock from "nock";
import { VideoClient } from "./video.client";
import type { PabipPeerConnection } from "./types";

describe("VideoClient", () => {
  const peer: PabipPeerConnection = {
    baseUrl: "https://acme.example.test",
    apiKey: "their-secret-key",
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it("creates a playback session", async () => {
    const scope = nock("https://acme.example.test")
      .post("/video/playback/node-1/session", {
        startDate: "2026-08-01T00:00:00Z",
      })
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(200, {
        streamUrl: "https://cdn.example.test/stream/1",
        expiresIn: 60,
      });

    const client = new VideoClient();
    const result = await client.createSession(peer, "node-1", {
      startDate: "2026-08-01T00:00:00Z",
    });

    expect(result).toEqual({
      streamUrl: "https://cdn.example.test/stream/1",
      expiresIn: 60,
    });
    expect(scope.isDone()).toBe(true);
  });

  it("gets the recordings catalog", async () => {
    const scope = nock("https://acme.example.test")
      .get("/video/playback/node-1/recordings")
      .reply(200, {
        firstClipDate: "2026-07-01",
        lastClipDate: "2026-08-01",
        discontinuities: [],
      });

    const client = new VideoClient();
    const result = await client.getRecordings(peer, "node-1");

    expect(result).toEqual({
      firstClipDate: "2026-07-01",
      lastClipDate: "2026-08-01",
      discontinuities: [],
    });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects when the peer refuses the session request", async () => {
    nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .reply(422, { message: "invalid date range" });

    const client = new VideoClient();

    await expect(
      client.createSession(peer, "node-1", {}),
    ).rejects.toMatchObject({
      response: { status: 422 },
    });
  });
});
