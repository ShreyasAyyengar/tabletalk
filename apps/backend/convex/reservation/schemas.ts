import { defineTable } from "convex/server";
import { zodToConvex } from "convex-helpers/server/zod";
import { z } from "zod";

export const reservationSchema = z.object({
  customerName: z.string(),

  booking: z.object({
    date: z.iso.datetime(),
    tableNumber: z.number(),
    partySize: z.number(),
  }),
  additionalNotes: z.array(z.string()),
});

export const reservationTable = defineTable(zodToConvex(reservationSchema));
