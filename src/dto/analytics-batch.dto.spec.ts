import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AnalyticsBatchDto } from "./analytics-batch.dto";

function buildValidEvent() {
  return {
    eventId: "a1b2c3d4-e5f6-4789-9012-3456789abcde",
    eventTime: "2026-05-08T14:00:00-03:00",
    sensorNodeId: "b2c3d4e5-e5f6-4789-9012-3456789abcde",
    partnerName: "Gabriel Tecnologia",
    latitude: -22.9528,
    longitude: -43.2076,
    evidenceUrl: "https://example.test/crop.jpg",
    data: { plate: "ABC1D23", confidence: 0.97 },
  };
}

function buildValidBatch(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    batchId: "c3d4e5f6-e5f6-4789-9012-3456789abcde",
    batchTime: "2026-05-08T14:00:00-03:00",
    batchCount: 1,
    batchType: "plate",
    events: [buildValidEvent()],
    ...overrides,
  };
}

describe("AnalyticsBatchDto", () => {
  it("accepts a well-formed batch", async () => {
    const dto = plainToInstance(AnalyticsBatchDto, buildValidBatch());
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("rejects a batch whose batchCount does not match events.length", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ batchCount: 2 }),
    );
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "batchCount")).toBe(true);
  });

  it("rejects an empty events array", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ events: [], batchCount: 0 }),
    );
    const errors = await validate(dto);
    expect(
      errors.some(
        (error) =>
          error.property === "events" || error.property === "batchCount",
      ),
    ).toBe(true);
  });

  it("rejects a batchType outside plate/face", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ batchType: "lpr-extended" }),
    );
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "batchType")).toBe(true);
  });

  it("rejects a non-UUID batchId", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ batchId: "not-a-uuid" }),
    );
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "batchId")).toBe(true);
  });

  it("rejects a batchTime that is not ISO 8601", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ batchTime: "not-a-date" }),
    );
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "batchTime")).toBe(true);
  });

  it("rejects a batch above the 500-event ceiling", async () => {
    const events = Array.from({ length: 501 }, () => buildValidEvent());
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({ events, batchCount: 501 }),
    );
    const errors = await validate(dto);
    expect(
      errors.some(
        (error) =>
          error.property === "events" || error.property === "batchCount",
      ),
    ).toBe(true);
  });

  it("rejects a malformed nested event, surfacing it via ValidateNested", async () => {
    const dto = plainToInstance(
      AnalyticsBatchDto,
      buildValidBatch({
        events: [{ ...buildValidEvent(), eventId: "not-a-uuid" }],
      }),
    );
    const errors = await validate(dto);
    const eventsError = errors.find((error) => error.property === "events");
    expect(
      eventsError?.children?.[0]?.children?.some(
        (child) => child.property === "eventId",
      ),
    ).toBe(true);
  });
});
