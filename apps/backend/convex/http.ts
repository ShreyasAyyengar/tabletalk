import { httpRouter } from "convex/server";
import { receiveAudio } from "./audio/process.ts";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: receiveAudio,
});

export default http;
