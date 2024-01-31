import { Elysia } from "elysia";
import { githubRouter } from "./github";

export const oauthRouter = new Elysia({prefix: "/oauth"})
    .use(githubRouter)