import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./src/libs/schema.ts",
    out: "./drizzle",
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN
    },
    verbose: true,
    strict: true,
}) 