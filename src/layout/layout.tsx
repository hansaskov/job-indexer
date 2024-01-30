import { Navbar } from "../components/navbar";
import { Head } from "./head";

export const Layout = ({ children, props }: { children: undefined | {}, props: {title: string} }) => (
  <Head props={props}>
    <div class="min-h-screen" hx-boost="true">
      <Navbar />
      <div >
        {children}
      </div>
    </div>
  </Head>
);