import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { Layout } from './layout/layout'
import { tailwind } from 'elysia-tailwind'
import { tailwindConfig } from './config/tailwind'
import { compression } from 'elysia-compression'



const app = new Elysia()
    .use(html())
    .use(tailwind(tailwindConfig))
    .get('/', () => {
        return (
            <Layout>
                Hello world
            </Layout>
        )
    })
    .listen(4321)

console.log(`🦊 Elysia is running at ${app.server?.url}`);

