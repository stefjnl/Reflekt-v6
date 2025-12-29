import { Shell } from "@/features/layout/shell";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Reflekt v6",
    description: "Premium Digital Diary",
};

import { db, entries as entriesTable } from "@reflekt/db";
import { desc } from "drizzle-orm";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const entries = await db.query.entries.findMany({
        orderBy: [desc(entriesTable.createdAt)],
        limit: 50 // Limit for sidebar performance initially
    });

    return (
        <html lang="en" className="h-full">
            <body className={`${inter.variable} h-full antialiased`}>
                <Shell entries={entries}>
                    {children}
                </Shell>
            </body>
        </html>
    );
}
