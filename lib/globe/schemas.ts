import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const CoordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict()
  .readonly();

export const FacilitySchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    countryCode: z.string().length(2),
    coordinates: CoordinatesSchema,
    status: z.enum(["operating", "under-construction", "shutdown", "planned"]),
    reactorCount: z.number().int().nonnegative(),
    totalCapacityMw: z.number().nonnegative(),
  })
  .strict()
  .readonly();

export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Facility = z.infer<typeof FacilitySchema>;
