'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { PropsWithChildren } from 'react';

export default function ClientLayout({ children }: PropsWithChildren) {
    return <AuthProvider>{children}</AuthProvider>;
} 