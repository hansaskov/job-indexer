import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { tailwind } from 'elysia-tailwind'
import { tailwindConfig } from './config/tailwind'
import { frontpage } from './routes'
import { loginRouter } from './routes/login'
import { logoutRouter } from './routes/logout'
import { oauthRouter } from './routes/oauth'



const app = new Elysia()
    .use(html())
    .use(tailwind(tailwindConfig))
    .use(frontpage)
    .use(logoutRouter)
    .use(loginRouter)
    .use(oauthRouter)
    .listen(4321)

console.log(`🦊 Elysia is running at ${app.server?.url}`);

