import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react'

interface ILink {
    href: string,
    text: string
}

const menu:ILink[] = [
    {
        href: "/",
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
        href: "/sertif-profesi-dan-serdos",
        text: "Sertifikat Profesi dan Serdos"
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

export const Sidebar = () => {
    const router = useRouter();

    return (
        <>
            <div className={styles.sidebar_box}>
                {menu.map((link: ILink, index: number) => (
                    <Link href={link.href} className={router.pathname === link.href ? styles.active : ""} key={index}>{link.text}</Link>
                ))}
            </div>
        </>
    );
}