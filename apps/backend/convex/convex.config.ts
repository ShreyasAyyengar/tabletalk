import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    WEBSITE_URL: v.string(),
  },
});
export default app;
