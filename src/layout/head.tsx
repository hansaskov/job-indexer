import { tailwindConfig } from "../config/tailwind";

export const Head = ({ children, props }: { children: undefined | {}, props: {title: string} }) => (
  <html lang="en" x-data="{ theme: $persist('lofi') }" x-bind:data-theme="theme || 'lofi'">
    <head>
      <meta charset="UTF-8" />
      <meta name="description" content="DESCRIPTION" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link href={tailwindConfig.path} rel="stylesheet"></link>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{props.title}</title>
      
      
      <script src="https://unpkg.com/htmx.org@2.0.0-alpha1/dist/htmx.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.13.5/dist/cdn.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js"></script>
    </head>
    <body>
      {children}
    </body>
  </html>
);