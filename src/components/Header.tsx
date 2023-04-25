import Profile from "@/assets/Profile";
import styles from "../styles/Header.module.css"
import DownTriangle from "@/assets/DownTriangle";
import { useState } from "react";
import ProfileDropDown from "./ProfileDropDown";

export const Header = () => {
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
                <div className={styles.name}>Nama Dosen</div>
                <div className={styles.avatar}><Profile/></div>
                <div className={styles.v}><DownTriangle/></div>
            </div>
        </div>
        {showDropModal ? <ProfileDropDown/> : ""}
        </>
    );
}