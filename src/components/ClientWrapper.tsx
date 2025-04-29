'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

const ClientLayout = dynamic(() => import('./ClientLayout'), {
    ssr: false,
});

export default function ClientWrapper({ children }: PropsWithChildren) {
    return <ClientLayout>{children}</ClientLayout>;
} 