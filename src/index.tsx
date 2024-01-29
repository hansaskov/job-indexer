import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { tailwind } from 'elysia-tailwind'
import { tailwindConfig } from './config/tailwind'
import { frontpage } from './routes'
import { auth } from './routes/auth'


const app = new Elysia()
    .use(html())
    .use(tailwind(tailwindConfig))
    .use(frontpage)
    .use(auth)
    .listen(4321)

console.log(`🦊 Elysia is running at ${app.server?.url}`);

