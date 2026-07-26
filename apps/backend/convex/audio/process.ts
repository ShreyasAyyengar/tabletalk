import { z } from "zod";
import { publicMutation } from "../lib/procedures.ts";

export const generateUploadUrl = publicMutation({
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const receiveAudio = publicMutation({
  args: {
    audioSegmentStorageId: z.string(), // TODO redo to z.custom<Id<"...">> once db schemas are generated
    customerName: z.string(),
  },
  handler: async (ctx, args) => {},
});
