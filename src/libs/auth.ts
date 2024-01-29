import { Lucia, TimeSpan } from "lucia";
import { GitHub, Google } from "arctic";
import { DatabaseUserAttributes, sessionTable, userTable } from "./schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(4, "w"),
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
           // secure:
        },
    },
    getUserAttributes: ({ }) => {
        return {};
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

/*
export const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,
);

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    "http://localhost:4321/api/oauth/google/callback",
);

*/