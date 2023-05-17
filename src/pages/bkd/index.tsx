"use client";

import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import { TDataBKD, TRespBKD } from './Types';
import FileIcon from '@/assets/FileIcon';
import Link from "next/link";
import PencilIcon from '../../assets/PencilIcon';
import React , {useContext, useEffect, useState} from 'react'
import DeleteIcon from "@/assets/DeleteIcon";
import Modal from "@/components/DeleteModal";
import Loading from "@/components/Loading";
import { useRouter } from 'next/router';
import axios from "axios";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";

const BKD = () => {
    const {accessToken} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();
    const [dataBKD, setDataBKD] = useState<TDataBKD[]>([]);

    useEffect(() => {
        setLoading(true);

        const getAllBKD = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getAllBkd`, auth);
                const res:TRespBKD = ax.data;
                setCount(res.count);
                setDataBKD(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllBKD();
    }, [])

    /* Delete Sertifikasi */
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        try {
            await axios({
                headers: auth.headers,
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/deleteBkdById/${id}/`
            }).then((res) => setDataBKD(dataBKD?.filter(d => d.id !== id)));

            count!==undefined ? setCount(count-1) : "";
            console.log("count", count);
        } catch (err) {
            console.log(err);
        }
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
    /*------------------------------------------*/

    return (
        <>
            <Layout>
                <div className={styles.page}>
                    <div className={styles.top}>
                        <div className={styles.current_page}>List BKD</div>
                        <Link href={{
                            pathname: "/bkd/write-data",
                            query: {
                                mode: "add",
                                id: "-1"
                            }
                        }} className="add_btn">Tambah</Link>
                        <div className="tooltip">Tambah data BKD</div>
                    </div>
                    {loading ? <div className={styles.loadingContainer}><Loading /></div> : ""}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Semester</th>
                                <th>Tahun Ajaran</th>
                                <th>File</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(count<1) ? <tr><td className={styles.noData} colSpan={6}>No data</td></tr> : ""}
                            {dataBKD?.map((data, idx) => (
                                <tr>
                                    <td>{idx+1}</td>
                                    <td>{data.semester}</td>
                                    <td>{data.start_year} - {data.end_year}</td>
                                    <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/bkd/getFileBkdById/")}>
                                        <FileIcon />
                                    </div></td>
                                    <td><Link href={{
                                        pathname: "/bkd/write-data",
                                        query: {
                                            mode: "edit",
                                            id: data.id
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