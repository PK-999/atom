import { z } from "zod";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const NonEmptyStringSchema = z.string().trim().min(1);

export const FacilityStatusSchema = z.enum([
  "operating",
  "under-construction",
  "shutdown",
  "decommissioned",
  "mixed",
]);

export const UnitStatusSchema = z.enum([
  "operating",
  "under-construction",
  "shutdown",
  "decommissioned",
]);

export const CoordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict()
  .readonly();

export const FacilitySourceSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    publisher: NonEmptyStringSchema,
    asOf: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD date format"),
    url: z.string().url().optional(),
  })
  .strict()
  .readonly();

export const FacilityUnitSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    unitNumber: z.number().int().positive(),
    reactorType: NonEmptyStringSchema,
    status: UnitStatusSchema,
    capacityMWe: z.number().nonnegative().nullable(), // nullable for explicit unknown capacity
    capacityBasis: z.enum(["net", "gross"]).default("net"),
    commercialYear: z.number().int().min(1950).max(2050).optional(),
    shutdownYear: z.number().int().min(1950).max(2050).optional(),
  })
  .strict()
  .readonly();

export const FacilitySchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    countryCode: z.string().length(2).toUpperCase(),
    countryName: NonEmptyStringSchema,
    coordinates: CoordinatesSchema,
    status: FacilityStatusSchema,
    reactorCount: z.number().int().nonnegative(),
    totalCapacityMw: z.number().nonnegative().nullable(),
    units: z.array(FacilityUnitSchema).default([]).readonly(),
    source: FacilitySourceSchema.optional(),
  })
  .strict()
  .readonly();

export type FacilityStatus = z.infer<typeof FacilityStatusSchema>;
export type UnitStatus = z.infer<typeof UnitStatusSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type FacilitySource = z.infer<typeof FacilitySourceSchema>;
export type FacilityUnit = z.infer<typeof FacilityUnitSchema>;
export type Facility = z.infer<typeof FacilitySchema>;
