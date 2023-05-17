import Profile from "@/assets/Profile";
import styles from "../styles/Header.module.css"
import DownTriangle from "@/assets/DownTriangle";
import { useContext, useEffect, useState } from "react";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { auth } from "@/utils/token";
import { UserContext } from "@/context/UserContext";

interface IUser {
    id: number,
    nip: string,
    role: number,
    nama: string,
    administrator: number,
    jabatan: number,
    prodi_kode?: string | number,
    prodi?: string | number,
    nik?: string,
    remember_token?: string,
    created_at?: string,
    updated_at?: string
}

export const Header = () => {
    const {profileName, setProfileName, setNip} = useContext(UserContext);
    const getUser = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, auth);
        const data:IUser = res.data; 
        setProfileName(data.nama);
        setNip(data.nip);
    }

    useEffect(() => {
        if (profileName === undefined) {
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
                <div className={styles.name} onClick={() => console.log("object")}>{profileName}</div>
                <div className={styles.avatar}><Profile/></div>
                <div className={styles.v}><DownTriangle/></div>
            </div>
        </div>
        {showDropModal ? <ProfileDropDown/> : ""}
        </>
    );
}