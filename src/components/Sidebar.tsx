'use client';

import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react'

interface ILink {
    idx: number,
    href: string,
    text: string
}

export const Sidebar = () => {
    const router = useRouter();
    const [menu, setMenu] = useState<ILink[]>([]);

    useEffect(() => {
        setMenu([
            {
                idx: 0,
                href: "/",
                text: "Home"
            },
            {
                idx: 1,
                href: "/data-penelitian",
                text: "Data Penelitian"
            },
            {
                idx: 2,
                href: "/data-pengabdian",
                text: "Data Pengabdian"
            },
            {
                idx: 3,
                href: "/sertif-profesi-dan-serdos",
                text: "Sertifikat Profesi dan Serdos"
            },
            {
                idx: 4,
                href: "/rekognisi-dan-narsum",
                text: "Rekognisi dan Narsum Dosen"
            },
            {
                idx: 5,
                href: "/haki",
                text: "HAKI"
            },
            {
                idx: 6,
                href: "/bkd",
                text: "BKD"
            },
            {
                idx: 7,
                href: "/biodata",
                text: "Biodata"
            }
        ])
    }, [])

    return (
        <>
            <div className={styles.sidebar_box}>
                {menu.map((link) => (
                    <Link href={link.href} className={router.pathname === link.href ? styles.active : ""} key={link.idx}>{link.text}</Link>
                ))}
            </div>
        </>
    );
}