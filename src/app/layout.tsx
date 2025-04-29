import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Todo App',
    description: 'A simple todo application built with Next.js and Supabase',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 min-h-screen`}>
                <ClientWrapper>{children}</ClientWrapper>
            </body>
        </html>
    );
}
