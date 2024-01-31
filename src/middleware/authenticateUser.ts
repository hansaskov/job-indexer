import { Elysia } from "elysia";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../libs/lucia";

export const authenticateUser = new Elysia()
    .derive(async ({ cookie, request }) => {
        if (request.method !== "GET") {
            const originHeader = request.headers.get("Origin");
            const hostHeader = request.headers.get("Host");
            if (
                !originHeader ||
                !hostHeader ||
                !verifyRequestOrigin(originHeader, [hostHeader])
            )
                return {
                    user: null,
                    session: null
                }
        }

        const sessionId = cookie[lucia.sessionCookieName].value ?? null
        if (!sessionId) {
            return {
                user: null,
                session: null
            }
        }

        const { session, user } = await lucia.validateSession(sessionId);


        if (session && session.fresh) {

            const sessionCookie = lucia.createSessionCookie(session.id);

            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes
            })
        }

        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes
            })
        }

        return {
            user,
            session
        }
    })





export const authenticatePrivatePage = ({ redirectURL }: { redirectURL: string }) => {
    return new Elysia()
        .use(authenticateUser)
        .onBeforeHandle(({ user, session, set }) => {
            if (!user || !session) {
                return (set.redirect = redirectURL)
            }
        })
        .derive(({ user, session }) => {
            if (user && session) {
                return { user, session }
            }

            return {}
        })

}