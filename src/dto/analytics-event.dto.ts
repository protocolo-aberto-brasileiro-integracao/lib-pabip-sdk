import {
  IsISO8601,
  IsLatitude,
  IsLongitude,
  IsNotEmptyObject,
  IsString,
  IsUUID,
  IsUrl,
} from "class-validator";

/**
 * `data`'s shape depends on the batch's `batchType` (`plate`/`face`) and must
 * only evolve additively per the PABIP protocol — this DTO only checks it is
 * a non-empty plain object, never a `plate`- or `face`-shaped one, so a
 * future additive field never becomes a breaking validation change here.
 */
export class AnalyticsEventDto {
  @IsUUID()
  eventId!: string;

  @IsISO8601()
  eventTime!: string;

  @IsUUID()
  sensorNodeId!: string;

  @IsString()
  partnerName!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsUrl(
    { require_protocol: true, require_tld: false },
    { message: "evidenceUrl must be a valid absolute URL" },
  )
  evidenceUrl!: string;

  @IsNotEmptyObject()
  data!: Record<string, unknown>;
}
