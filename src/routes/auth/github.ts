import { OAuth2RequestError, generateState } from "arctic";
import { Elysia, t } from "elysia";
import { github, lucia, } from "../../libs/lucia";
import { db } from "../../libs/db";
import { oauthTable, userTable } from "../../libs/schema";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";


const PROVIDER = "github";
const COOKIE_KEY = "github_oauth_state"
const TEN_MINUTES = 60 * 10

export const githubRouter = new Elysia({ prefix: "/github" })
    .get("/", async ({ cookie, set }) => {

        const state = generateState()
        const url = await github.createAuthorizationURL(state, {
            scopes: ["user:email"]
        })

        cookie[COOKIE_KEY].set({
            value: state,
            path: "/",
            secure: false,
            httpOnly: true,
            maxAge: TEN_MINUTES,
            sameSite: "lax"
        })

        set.redirect = url.toString()

    })
    .get("/callback", async ({ cookie, query: { code, state }, set }) => {

        const storedState = cookie[COOKIE_KEY].value

        if (state !== storedState) {
            set.status = 400
            return
        }

        try {

            const tokens = await github.validateAuthorizationCode(code);
            const init: RequestInit = {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            };

            const [githubUserResponse, githubEmailResponse] = await Promise.all([
                await fetch("https://api.github.com/user", init),
                await fetch("https://api.github.com/user/emails", init),
            ]);

            const [githubUser, githubEmails]: [GitHubUser, GitHubEmail[]] =
                await Promise.all([
                    githubUserResponse.json(),
                    githubEmailResponse.json(),
                ]);


            const githubEmail = githubEmails.filter(({ primary }) => primary)[0];

            if (!githubEmail) {
                set.status = 400
                return
            }

            const existingUser = (
                await db
                    .select()
                    .from(oauthTable)
                    .where(
                        and(
                            eq(oauthTable.provider, PROVIDER),
                            eq(oauthTable.providerId, githubUser.id),
                        ),
                    )
            ).at(0);


            if (existingUser) {
                const session = await lucia.createSession(existingUser.userId, {});
                const sessionCookie = lucia.createSessionCookie(session.id);

                cookie[sessionCookie.name].set({
                    value: sessionCookie.value,
                    ...sessionCookie.attributes
                })
                set.redirect = "/"
                return
            }

            const userId = generateId(15);

            await db.transaction(async (tx) => {
                await tx.insert(userTable).values({
                    id: userId,
                    username: githubUser.login,
                    email: githubEmail.email,
                    isEmailVerified: githubEmail.verified,
                });

                await tx.insert(oauthTable).values({
                    userId: userId,
                    provider: PROVIDER,
                    providerId: githubUser.id,
                });
            });

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes
            })

            set.redirect = "/"

        } catch (e) {
            if (
                e instanceof OAuth2RequestError &&
                e.message === "bad_verification_code"
            ) {
                set.status = 400
            }
            set.status = 500
        }
    }, {
        query: t.Object({
            code: t.String(),
            state: t.String(),
        }),
    })




interface GitHubUser {
    id: string;
    login: string;
}

interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}
