import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    // const [user, setUser] = useState<any>();

    // useEffect(() => {
    //     const getUser = () => {
    //         const windowhref = window.location.href
    //         const code = windowhref.split("code=")[1]
    //         console.log(code)

    //         fetch(`https://mberkas.unhas.ac.id/oauth/token?client_id=11&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/callback&client_secret=gIodIswCE0t51qjikHjqpM8FuQq9THuuLOc2v2HO&code=${code}`, {
    //             method: "POST",

    //         }).then(response => {
    //             console.log("response", response);
    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //             throw new Error("authentication has been failed!")
    //         }).then((resObject) => {
    //             // setUser(resObject.user)
    //             console.log("resobjectttttt", resObject);
    //         }).catch((err) => {
    //             console.log(err)
    //         })
    //     }

    //     getUser();
    // }, [])

    return <Component {...pageProps} />
}
