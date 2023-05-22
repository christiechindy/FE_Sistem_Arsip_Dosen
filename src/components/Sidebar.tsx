import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from "@/context/UserContext";

interface ILink {
    href: string,
    text: string
}

const menu:ILink[] = [
    {
        href: "/home",
        text: "Home"
    },
    {
        href: "/data-penelitian",
        text: "Data Penelitian"
    },
    {
        href: "/data-pengabdian",
        text: "Data Pengabdian"
    },
    {
        href: "/artikel-ilmiah",
        text: "Publikasi Jurnal Artikel Ilmiah"
    },
    {
        href: "/sertifikasi",
        text: "Sertifikat Profesi dan Dosen"
    },
    {
        href: "/rekognisi-dan-narsum",
        text: "Rekognisi dan Narsum Dosen"
    },
    {
        href: "/haki",
        text: "HAKI"
    },
    {
        href: "/bkd",
        text: "BKD"
    },
    {
        href: "/biodata",
        text: "Biodata"
    }
]

const menuKhususAdmin:ILink[] = [
    {
        href: "/data-lulusan",
        text: "Data Lulusan"
    },
    {
        href: "/kerja-sama",
        text: "Kerja Sama"
    },
    {
        href: "/file-tambahan",
        text: "File Tambahan"
    }
]

export const Sidebar = () => {
    const router = useRouter();
    const {role} = useContext(UserContext);

    return (
        <>
            <div className={styles.sidebar_box}>
                {menu.map((link: ILink, index: number) => (
                    <Link href={link.href} className={router.pathname.startsWith(link.href) ? styles.active : ""} key={index}>{link.text}</Link>
                ))}
                {role === 1 ? 
                    menuKhususAdmin.map((link: ILink, index: number) => (
                        <Link href={link.href} className={router.pathname.startsWith(link.href) ? styles.active : ""} key={index}>{link.text}</Link>
                    )) : ""
                }
            </div>
        </>
    );
}