import { createContext, useEffect, useState } from "react";
import { CookieValueTypes, getCookie } from "cookies-next";

export const UserContext = createContext<any>(null);

interface IProps {
    children: any
}

export const UserContextProvider = ({children}: IProps) => {
    const [accessToken, setAccessToken] = useState<CookieValueTypes>(getCookie("access_token") || null);
    const [profileName, setProfileName] = useState<string>("");
    const [nip, setNip] = useState<CookieValueTypes>(getCookie("nip") || null);
    const [role, setRole] = useState<CookieValueTypes>(getCookie("role") || null);

    return(
        <UserContext.Provider value={{accessToken, setAccessToken, profileName, setProfileName, nip, setNip, role, setRole}}>
            {children}
        </UserContext.Provider>
    );
}