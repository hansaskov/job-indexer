import { Elysia } from "elysia";
import { Layout } from "../layout/layout";

export const frontpage = new Elysia({ prefix: "/" })
    .get('/', ({store}) => {
        return (
            <Layout props={{title: "Homepage"}}>
                Hello world
            </Layout>
        )
    })