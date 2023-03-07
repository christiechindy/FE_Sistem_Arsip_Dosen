"use client";

import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import { TDataBKD, TResponse, TNewBKD } from './Interfaces';
import FileIcon from '@/assets/FileIcon';
import Link from "next/link";
import PencilIcon from '../../assets/PencilIcon';
import React , {useEffect, useState} from 'react'
import DeleteIcon from "@/assets/DeleteIcon";
import Modal from "@/components/DeleteModal";
import Loading from "@/components/Loading";
import { useRouter } from 'next/router';
import {promises as fs} from "fs";

const BKD = () => {
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [data_bkd, setData_bkd] = useState<TDataBKD[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getAllBkd`)
            .then((res) => res.json())
            .then((data:TResponse) => {
                setData_bkd(data.data);
                setLoading(false);
            })
            .catch(err => console.error("Error: ", err));
    }, [router.pathname])

    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = (id: string): void => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/deleteBkdById/${id}`, {
            method: "DELETE"
        }).then(() => setData_bkd(data_bkd.filter(d => d.id !== id)))
    }

    useEffect(() => {
        if (sure_to_del) {
            deleteHandler(id_to_del);
            setShowDelModal(false);
        }
    }, [sure_to_del])

    useEffect(() => {
        if (!showDelModal) {
            setId_to_del("");
            setSure_to_del(false);
        }
    }, [showDelModal])

    const fileOpenHandler = async (id: string) => {
        console.log(id);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getFileBkdById/${id}`).then((data) => data.json())
        console.log(res)
    }

    return (
        <>
            <Layout>
                <div className={styles.page}>
                    <div className={styles.top}>
                        <div className={styles.current_page}>List BKD</div>
                        <Link href="/bkd/add-data" className="add_btn">Tambah</Link>
                    </div>
                    {loading ? <div className={styles.loadingContainer}><Loading /></div> : ""}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NIP Dosen</th>
                                <th>Tahun Ajaran</th>
                                <th>Semester</th>
                                <th>File</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data_bkd?.map((data, idx) => (
                                <tr>
                                    <td>{idx+1}</td>
                                    <td>{data.dosen_nip}</td>
                                    <td>{data.tahun_ajaran}</td>
                                    <td>{data.semester}</td>
                                    <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id)}>
                                        <FileIcon />
                                    </div></td>
                                    <td><Link href="" className={styles.iconlink}>
                                        <PencilIcon />
                                    </Link></td>
                                    <td><div className={styles.iconlink} onClick={() => {
                                        setShowDelModal(true);
                                        setId_to_del(data.id);
                                    }}>
                                        <DeleteIcon />    
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showDelModal ? <Modal showDelModal={showDelModal} setShowDelModal={setShowDelModal} setSure_to_del={setSure_to_del} /> : ""}
                </div>
            </Layout>
        </>
    );
}



export default BKD;