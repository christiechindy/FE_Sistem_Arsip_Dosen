"use client";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<string>("");

export const AuthContextProvider = ({children}: any) => {
    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        const locs = localStorage.getItem("access_token")
        if (locs) {
            setAccessToken(locs);
            console.log("locsss", locs);
        }
    }, [])

    return (
        <AuthContext.Provider value={{accessToken}}>
            {children}
        </AuthContext.Provider>
    );
}