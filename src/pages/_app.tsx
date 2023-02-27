import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// import React, { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    // useEffect(() => {
    //     require("bootstrap/dist/js/bootstrap");
    // },[])

    return <Component {...pageProps} />
}
