import { Navbar } from "../components/navbar";
import { Head } from "./head";

export const Layout = ({ children, props }: { children: undefined | {}, props: {title: string} }) => (
  <Head props={props}>
    <div class="min-h-screen">
      <Navbar />
      <div hx-boost="true">
        {children}
      </div>
    </div>
  </Head>
);