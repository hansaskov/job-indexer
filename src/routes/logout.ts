import { Elysia } from "elysia";
import { authenticateUser } from "../middleware/authenticateUser";
import { lucia } from "../libs/lucia";

export const logoutRouter = new Elysia({ scoped: false})
    .use(authenticateUser)
    .post("/logout", async ({ session, cookie, set }) => {

        console.log("hello")

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
            ...sessionCookie.attributes
        })


        // After invalidating the session, also redirect to the login page
        return (set.redirect = "/login")

    })
