import type { Metadata } from "next";
import '@/assets/styles/globals.css'
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants"
import Header from "@/components/shared/header";
import Footer from "@/components/footer";
export const metadata: Metadata = {
    title: `${APP_NAME}`,
    description: `${APP_DESCRIPTION}`,

};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen bg-primary-bg overflow-scroll">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
