import type { Metadata } from "next";
import { Inter, Red_Hat_Display } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "@/components/ui/sonner";
const red_hat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: { template: `%s | ${APP_NAME}`, default: APP_NAME },
  // title: APP_NAME,
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${red_hat.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PageTransition>
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  actionButton:
                    "bg-primary-text! text-primary-bg! hover:bg-black/80 px-4 py-2! rounded-xl! font-semibold",
                  toast:
                    "bg-primary-text text-primary-bg border border-primary-text/20 rounded-xl! lg:min-w-[380px]! shadow-lg",
                },
              }}
              // toastOptions={{
              //   className:
              //     "bg-primary-text text-primary-bg border border-primary-text/20 rounded-xl! lg:min-w-[380px]! shadow-lg",
              // }}
            />
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
