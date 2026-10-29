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
        sessionId: "018f9b7c-0000-7000-8000-000000000001",
        streamUrl: "https://cdn.example.test/stream/1",
        expiresIn: 60,
      });

    const client = new VideoClient();
    const result = await client.createSession(peer, "node-1", {
      startDate: "2026-08-01T00:00:00Z",
    });

    expect(result).toMatchObject({
      sessionId: "018f9b7c-0000-7000-8000-000000000001",
      streamUrl: "https://cdn.example.test/stream/1",
      expiresIn: 60,
    });
    expect(typeof result.requestId).toBe("string");
    expect(result.requestId.length).toBeGreaterThan(0);
    expect(scope.isDone()).toBe(true);
  });

  it("sends an allowlist in the session request body", async () => {
    const scope = nock("https://acme.example.test")
      .post("/video/playback/node-1/session", {
        startDate: "2026-08-01T00:00:00Z",
        allowlist: ["203.0.113.10", "198.51.100.0/24"],
      })
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(200, {
        sessionId: "018f9b7c-0000-7000-8000-000000000010",
        streamUrl: "https://cdn.example.test/stream/10",
        expiresIn: 60,
      });

    const client = new VideoClient();
    await client.createSession(peer, "node-1", {
      startDate: "2026-08-01T00:00:00Z",
      allowlist: ["203.0.113.10", "198.51.100.0/24"],
    });

    expect(scope.isDone()).toBe(true);
  });

  it("always sends X-Request-Id even when no traceability is provided", async () => {
    const scope = nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .matchHeader("X-Request-Id", /.+/)
      .reply(200, {
        sessionId: "018f9b7c-0000-7000-8000-000000000011",
        streamUrl: "https://cdn.example.test/stream/11",
        expiresIn: 60,
      });

    const client = new VideoClient();
    const result = await client.createSession(peer, "node-1", {});

    expect(result.requestId.length).toBeGreaterThan(0);
    expect(scope.isDone()).toBe(true);
  });

  it("reuses the caller's request id when exposing it on the result", async () => {
    nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .matchHeader("X-Request-Id", "req-caller")
      .reply(200, {
        sessionId: "018f9b7c-0000-7000-8000-000000000012",
        streamUrl: "https://cdn.example.test/stream/12",
        expiresIn: 60,
      });

    const client = new VideoClient();
    const result = await client.createSession(
      peer,
      "node-1",
      {},
      { requestId: "req-caller" },
    );

    expect(result.requestId).toBe("req-caller");
  });

  it("exposes the request id echoed in the response header", async () => {
    nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .reply(
        200,
        {
          sessionId: "018f9b7c-0000-7000-8000-000000000013",
          streamUrl: "https://cdn.example.test/stream/13",
          expiresIn: 60,
        },
        { "X-Request-Id": "req-echoed" },
      );

    const client = new VideoClient();
    const result = await client.createSession(peer, "node-1", {});

    expect(result.requestId).toBe("req-echoed");
  });

  it("falls back to the request id carried in the response body", async () => {
    nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .reply(200, {
        sessionId: "018f9b7c-0000-7000-8000-000000000014",
        streamUrl: "https://cdn.example.test/stream/14",
        expiresIn: 60,
        requestId: "req-from-body",
      });

    const client = new VideoClient();
    const result = await client.createSession(peer, "node-1", {});

    expect(result.requestId).toBe("req-from-body");
  });

  it("forwards traceability headers when provided on session creation", async () => {
    const scope = nock("https://acme.example.test")
      .post("/video/playback/node-1/session")
      .matchHeader("X-API-Key", "their-secret-key")
      .matchHeader("X-Request-Id", "req-123")
      .matchHeader("X-Actor-Id", "actor-9")
      .matchHeader("X-Case-Ref", "case-abc")
      .reply(200, {
        sessionId: "018f9b7c-0000-7000-8000-000000000002",
        streamUrl: "https://cdn.example.test/stream/2",
        expiresIn: 60,
      });

    const client = new VideoClient();
    await client.createSession(
      peer,
      "node-1",
      {},
      { requestId: "req-123", actorId: "actor-9", caseRef: "case-abc" },
    );

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

  it("deletes a playback session", async () => {
    const scope = nock("https://acme.example.test")
      .delete("/video/playback/session/session-1")
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(204);

    const client = new VideoClient();
    await client.deleteSession(peer, "session-1");

    expect(scope.isDone()).toBe(true);
  });

  it("forwards traceability headers when deleting a session", async () => {
    const scope = nock("https://acme.example.test")
      .delete("/video/playback/session/session-1")
      .matchHeader("X-API-Key", "their-secret-key")
      .matchHeader("X-Request-Id", "req-456")
      .matchHeader("X-Actor-Id", "actor-7")
      .matchHeader("X-Case-Ref", "case-xyz")
      .reply(204);

    const client = new VideoClient();
    await client.deleteSession(peer, "session-1", {
      requestId: "req-456",
      actorId: "actor-7",
      caseRef: "case-xyz",
    });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects when the session is unknown to the peer", async () => {
    nock("https://acme.example.test")
      .delete("/video/playback/session/missing")
      .reply(404, { type: "session-not-found", status: 404 });

    const client = new VideoClient();

    await expect(client.deleteSession(peer, "missing")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
