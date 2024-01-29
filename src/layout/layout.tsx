import { Navbar } from "../components/navbar";
import { Head } from "./head";

export const Layout = ({ children }: { children: undefined | {} }) => (
  <Head >
    <div class="min-h-screen">
      <Navbar />
      {children}
    </div>
  </Head>
);