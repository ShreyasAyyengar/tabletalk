import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reservations: defineTable({
    customer: v.string(),
    party_size: v.number(),
    date: v.string(),      // "2026-07-26"
    time: v.string(),      // "19:00"
    table_id: v.number(),
    notes: v.optional(v.string()),
  }).index("by_date_time", ["date", "time"]),
});