import nock from "nock";
import { SensorNodesClient } from "./sensor-nodes.client";
import type { PabipPeerConnection } from "./types";

describe("SensorNodesClient", () => {
  const peer: PabipPeerConnection = {
    baseUrl: "https://acme.example.test/",
    apiKey: "their-secret-key",
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it("lists sensor nodes with the peer credential, page, and pageSize, trimming a trailing slash from baseUrl", async () => {
    const scope = nock("https://acme.example.test")
      .get("/sensor-nodes")
      .query({ page: "2", pageSize: "50" })
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(200, {
        items: [],
        page: 2,
        pageSize: 50,
        total: 0,
        totalPages: 0,
      });

    const client = new SensorNodesClient();
    const result = await client.listSensorNodes(peer, 2, 50);

    expect(result).toEqual({
      items: [],
      page: 2,
      pageSize: 50,
      total: 0,
      totalPages: 0,
    });
    expect(scope.isDone()).toBe(true);
  });

  it("gets a single sensor node by id", async () => {
    const scope = nock("https://acme.example.test")
      .get("/sensor-nodes/node-1")
      .matchHeader("X-API-Key", "their-secret-key")
      .reply(200, { id: "node-1" });

    const client = new SensorNodesClient();
    const result = await client.getSensorNode(peer, "node-1");

    expect(result).toEqual({ id: "node-1" });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects when the peer responds with an error status", async () => {
    nock("https://acme.example.test")
      .get("/sensor-nodes/missing")
      .reply(404, { message: "not found" });

    const client = new SensorNodesClient();

    await expect(client.getSensorNode(peer, "missing")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
