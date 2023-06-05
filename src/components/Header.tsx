import Profile from "@/assets/Profile";
import styles from "../styles/Header.module.css"
import DownTriangle from "@/assets/DownTriangle";
import { useContext, useEffect, useState } from "react";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { setCookie } from "cookies-next";

interface IUser {
    id: number,
    nip: string,
    role: number, // ADMIN(role=1), DOSEN(role=2)
    nama: string,
    remember_token?: string,
    created_at?: string,
    updated_at?: string
}

export const Header = () => {
    const {accessToken, profileName, setProfileName, setNip, setRole} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const getUser = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, auth);
        const data:IUser = res.data; 
        setProfileName(data.nama);
        setRole(data.role);
        setNip(data.nip);
        setCookie("role", data.role);
        setCookie("nip", data.nip);
    }

    useEffect(() => {
        if (profileName === "") {
            getUser();
        }
    }, []);
    
    const [showDropModal, setShowDropModal] = useState<boolean>(false);
    const dropClick = () => {
        setShowDropModal(prev => !prev)
    }

    return (
        <>
        <div className={styles.header}>
            <div className={styles.app_name}>
                Pengarsipan Dokumen Kerja Dosen
            </div>
            <div className={styles.account} onClick={dropClick}>
                <div className={styles.name}>{profileName}</div>
                <div className={styles.avatar}><Profile/></div>
                <div className={styles.v}><DownTriangle/></div>
            </div>
        </div>
        {showDropModal ? <ProfileDropDown/> : ""}
        </>
    );
}