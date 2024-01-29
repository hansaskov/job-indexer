import { Elysia } from "elysia";
import { authenticateUser } from "../middleware/authenticateUser";
import { Layout } from "../layout/layout";


export const auth = new Elysia({ prefix: "/auth" })
    .use(authenticateUser)
    .get("/login", ({ user, set }) => {

        if (user) {
            set.redirect = "/"
            return
        }

        return (
            <Layout props={{title: "Login page"}}>
                <a class="btn btn-ghost" href="/api/oauth/github">Sign in with GitHub</a>
                <a class="btn btn-ghost" href="/api/oauth/google">Sign in with Google</a>
            </Layout>
        )
    })
    .post("/logout", () => (<p>Hello beutiful</p>))
