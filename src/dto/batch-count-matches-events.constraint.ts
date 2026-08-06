import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import type { AnalyticsBatchDto } from "./analytics-batch.dto";

/**
 * Cross-field check the PABIP envelope requires: `batchCount` must equal
 * `events.length`. `class-validator`'s built-in decorators can't express
 * this alone since both fields live on the same object — implemented as a
 * `ValidatorConstraint` so a violation surfaces through the same `validate()`
 * pass as every other field.
 */
@ValidatorConstraint({ name: "batchCountMatchesEvents", async: false })
export class BatchCountMatchesEventsConstraint implements ValidatorConstraintInterface {
  validate(batchCount: number, args: ValidationArguments): boolean {
    const object = args.object as Partial<AnalyticsBatchDto>;
    return Array.isArray(object.events) && object.events.length === batchCount;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as Partial<AnalyticsBatchDto>;
    const eventsLength = Array.isArray(object.events)
      ? object.events.length
      : "unknown";
    return `batchCount (${String(args.value)}) must equal events.length (${eventsLength})`;
  }
}

export function BatchCountMatchesEvents(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: BatchCountMatchesEventsConstraint,
    });
  };
}
