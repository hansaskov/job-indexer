import { Elysia } from "elysia";
import { Layout } from "../layout/layout";

export const frontpage = new Elysia()
    .get('/', ({}) => {
        return (
            <Layout props={{title: "Homepage"}}>
                Hello world
            </Layout>
        )
    })