import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AnalyticsEventDto } from "./analytics-event.dto";

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

describe("AnalyticsEventDto", () => {
  it("accepts a well-formed plate event", async () => {
    const dto = plainToInstance(AnalyticsEventDto, buildValidEvent());
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("accepts a well-formed face event (only confidence in data)", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      data: { confidence: 0.95 },
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("accepts a future, additive data shape without rejecting it", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      data: {
        plate: "ABC1D23",
        confidence: 0.97,
        someFutureOptionalField: "value",
      },
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("rejects a non-UUID eventId", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      eventId: "not-a-uuid",
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "eventId")).toBe(true);
  });

  it("rejects a non-UUID sensorNodeId", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      sensorNodeId: "nope",
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "sensorNodeId")).toBe(
      true,
    );
  });

  it("rejects an out-of-range latitude", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      latitude: 200,
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "latitude")).toBe(true);
  });

  it("rejects a non-URL evidenceUrl", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      evidenceUrl: "not-a-url",
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "evidenceUrl")).toBe(true);
  });

  it("rejects an empty data object", async () => {
    const dto = plainToInstance(AnalyticsEventDto, {
      ...buildValidEvent(),
      data: {},
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "data")).toBe(true);
  });

  it("rejects a missing data field", async () => {
    const event = buildValidEvent() as Partial<
      ReturnType<typeof buildValidEvent>
    >;
    delete event.data;
    const dto = plainToInstance(AnalyticsEventDto, event);
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === "data")).toBe(true);
  });
});
