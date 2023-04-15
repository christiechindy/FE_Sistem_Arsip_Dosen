import { AuthContextProvider } from '@/context/AuthContext';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthContextProvider>
            <Component {...pageProps} />
        </AuthContextProvider>
    )
}
