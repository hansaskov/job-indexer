import { Elysia } from "elysia";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../libs/auth";

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

            cookie[lucia.sessionCookieName].set({
                value: sessionCookie.value,
                domain: sessionCookie.attributes.domain,
                expires: sessionCookie.attributes.expires,
                maxAge: sessionCookie.attributes.maxAge,
                path: sessionCookie.attributes.path,
                secure: sessionCookie.attributes.secure,
                httpOnly: sessionCookie.attributes.httpOnly,
                sameSite: sessionCookie.attributes.sameSite,
                ...sessionCookie.attributes
            })
        }

        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookie[lucia.sessionCookieName].set({
                value: sessionCookie.value,
                domain: sessionCookie.attributes.domain,
                expires: sessionCookie.attributes.expires,
                maxAge: sessionCookie.attributes.maxAge,
                path: sessionCookie.attributes.path,
                secure: sessionCookie.attributes.secure,
                httpOnly: sessionCookie.attributes.httpOnly,
                sameSite: sessionCookie.attributes.sameSite,
                ...sessionCookie.attributes
            })
        }

        return {
            user,
            session
        }
    })
