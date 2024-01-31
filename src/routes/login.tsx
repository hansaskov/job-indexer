import { Elysia } from "elysia";
import { authenticateUser } from "../middleware/authenticateUser";
import { Layout } from "../layout/layout";


export const loginRouter = new Elysia({ scoped: false})
.use(authenticateUser)
.get("/login", ({ user, set }) => {

    if (user) {
        set.redirect = "/"
        return
    }

    return (
        <Layout props={{ title: "Login page" }}>
            <a hx-boost="false" class="btn btn-ghost" href="/oauth/github">Sign in with GitHub</a>
            <a class="btn btn-ghost" href="/oauth/google">Sign in with Google</a>
        </Layout>
    )
})
