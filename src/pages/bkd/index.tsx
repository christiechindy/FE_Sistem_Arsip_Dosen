"use client";

import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import { TDataBKD, TResponse } from './Types';
import FileIcon from '@/assets/FileIcon';
import Link from "next/link";
import PencilIcon from '../../assets/PencilIcon';
import React , {useEffect, useState} from 'react'
import DeleteIcon from "@/assets/DeleteIcon";
import Modal from "@/components/DeleteModal";
import Loading from "@/components/Loading";
import { useRouter } from 'next/router';

const BKD = () => {
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [data_bkd, setData_bkd] = useState<TDataBKD[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getAllBkd`)
            .then((res) => res.json())
            .then((data:TResponse) => {
                setCount(data.count);
                setData_bkd(data.data);
                setLoading(false);
            })
            .catch(err => console.error("Error: ", err));
    }, [])

    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/deleteBkdById/${id}`, {
            method: "DELETE"
        }).then(() => setData_bkd(data_bkd.filter(d => d.id !== id)))
        count!==undefined ? setCount(count-1) : "";
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
        console.log("fileOpenHandler clickesd");
        console.log(id);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getFileBkdById/${id}`, {
            method: "GET"
        }).then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          })
    }

    return (
        <>
            <Layout>
                <div className={styles.page}>
                    <div className={styles.top}>
                        <div className={styles.current_page}>List BKD</div>
                        <Link href="/bkd/add-data" className="add_btn">Tambah</Link>
                        <div className="tooltip">Tambah data BKD</div>
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
                            {(count<1) ? <tr><td className={styles.noData} colSpan={7}>No data</td></tr> : ""}
                            {data_bkd?.map((data, idx) => (
                                <tr>
                                    <td>{idx+1}</td>
                                    <td>{data.dosen_nip}</td>
                                    <td>{data.start_year} - {data.end_year}</td>
                                    <td>{data.semester}</td>
                                    <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id)}>
                                        <FileIcon />
                                    </div></td>
                                    <td><Link href={{
                                        pathname: "/bkd/edit-data",
                                        query: {
                                            id: data.id,
                                            dosen_nip: data.dosen_nip,
                                            start_year: data.start_year,
                                            end_year: data.end_year,
                                            semester: data.semester,
                                            file_bkd: data.file_bkd
                                        }
                                    }} className={styles.iconlink}>
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