import "./globals.css";
import { Providers } from "@/components/layout/ThemeProvider";
import { smileySansFont } from "@/config/fonts";
import { HomeMetadata } from "@/config/metadata";
import { HomeViewport } from "@/config/viewport";
import { PropsWithChildren } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata = HomeMetadata;
export const viewport = HomeViewport;

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={smileySansFont.className}
    >
      <head />
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Header />
            <main className="w-full flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
