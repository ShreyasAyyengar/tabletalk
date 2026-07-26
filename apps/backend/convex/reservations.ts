import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const TOTAL_TABLES = 10; // pretend the restaurant has 10 tables

export const checkAvailability = query({
  args: { date: v.string(), time: v.string(), party_size: v.number() },
  handler: async (ctx, args) => {
    const booked = await ctx.db
      .query("reservations")
      .withIndex("by_date_time", (q) =>
        q.eq("date", args.date).eq("time", args.time)
      )
      .collect();

    const available = booked.length < TOTAL_TABLES;
    return {
      available,
      tables_left: TOTAL_TABLES - booked.length,
      suggested_table: available ? booked.length + 1 : null,
    };
  },
});

export const createReservation = mutation({
  args: {
    customer: v.string(),
    party_size: v.number(),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booked = await ctx.db
      .query("reservations")
      .withIndex("by_date_time", (q) =>
        q.eq("date", args.date).eq("time", args.time)
      )
      .collect();

    if (booked.length >= TOTAL_TABLES) {
      return { confirmed: false, reason: "fully booked" };
    }

    const id = await ctx.db.insert("reservations", {
      ...args,
      table_id: booked.length + 1,
    });
    return { confirmed: true, reservation_id: id, table_id: booked.length + 1 };
  },
});