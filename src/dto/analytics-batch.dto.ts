import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsISO8601,
  IsInt,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { AnalyticsEventDto } from "./analytics-event.dto";
import { BatchCountMatchesEvents } from "./batch-count-matches-events.constraint";

export const BATCH_TYPES = ["plate", "face"] as const;
export type BatchType = (typeof BATCH_TYPES)[number];

/** Cardinality ceiling fixed by the PABIP protocol — never a config field. */
export const MAX_BATCH_EVENTS = 500;

/**
 * The PABIP analytics batch envelope. `events`'s cardinality (1-500) and
 * `batchCount === events.length` both come from the protocol's
 * `invalid_envelope` rule — a batch failing either is rejected whole, never
 * partially accepted.
 */
export class AnalyticsBatchDto {
  @IsUUID()
  batchId!: string;

  @IsISO8601()
  batchTime!: string;

  @IsInt()
  @Min(1)
  @Max(MAX_BATCH_EVENTS)
  @BatchCountMatchesEvents()
  batchCount!: number;

  @IsIn(BATCH_TYPES)
  batchType!: BatchType;

  @ValidateNested({ each: true })
  @Type(() => AnalyticsEventDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_BATCH_EVENTS)
  events!: AnalyticsEventDto[];
}
