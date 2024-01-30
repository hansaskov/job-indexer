import { Elysia } from "elysia";
import { authenticateUser } from "../middleware/authenticateUser";
import { Layout } from "../layout/layout";
import { lucia } from "../libs/lucia";
import { githubRouter } from "./auth/github";


export const auth = new Elysia({ prefix: "/auth" })
    .use(githubRouter)
    .use(authenticateUser)
    .get("/login", ({ user, set }) => {

        if (user) {
            set.redirect = "/"
            return
        }

        return (
            <Layout props={{ title: "Login page" }}>
                <a hx-boost="false" class="btn btn-ghost" href="/auth/github">Sign in with GitHub</a>
                <a class="btn btn-ghost" href="/auth/google">Sign in with Google</a>
            </Layout>
        )
    })
    .post("/logout", async ({ session, cookie, set }) => {

        // Redirect to login page if not logged in
        if (!session) {
            set.redirect = "/"
            return
        }

        // Invalidate cookie
        await lucia.invalidateSession(session.id);

        const sessionCookie = lucia.createBlankSessionCookie();
        cookie[sessionCookie.name].set({
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


        // After invalidating the session, also redirect to the login page
        set.redirect = "/login"
   
        return


    })
    
