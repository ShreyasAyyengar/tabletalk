import { defineSchema } from "convex/server";
import { reservationTable } from "./reservation/schemas.ts";

export default defineSchema({
  reservations: reservationTable,
});
