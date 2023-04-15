"use client";

import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState, useEffect, useContext } from 'react';
import Modal from "@/components/DeleteModal";
import { TResponse, TDataPenelitian } from './Types';
import UpFileModal from "@/components/UpFileModal";
import { useRouter } from "next/router";
import Router from "next/router";
import Loading from "@/components/Loading";
import axios from 'axios';

// interface IProps {
//     data_penelitian: TResponse;
// }

const DataPenelitian = () => {
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [showUpFileModal, setShowUpFileModal] = useState<boolean>(false);

    /* Get ALl Data Penelitian -> run at first render */
    const [dataPenelitian, setDataPenelitian] = useState<TDataPenelitian[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);    

        const auth = {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        };

        const getDataPenelitian = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getAllPenelitian`, auth);
                const res:TResponse = ax.data;
                setCount(res.count);
                setDataPenelitian(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getDataPenelitian();
    }, [])

    /* Delete a research data */
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        try {
            console.log("id yg mau didel", id);
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/deletePenelitianById/${id}`).then(() => setDataPenelitian(dataPenelitian?.filter(d => d.id !== id)))
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

    /* Edit Data */
    


    /* Open file */
    const fileOpenHandler = async (id: string) => {
        console.log("fileOpenHandler clickesd");
        console.log(id);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getFilePenelitianById/${id}`, {
            method: "GET"
        }).then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          })
    }
    /*------------------------------------------*/

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <Link href="/data-penelitian/add-data" className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload file penelitian</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading /></div> : "" }
                {showUpFileModal ? <UpFileModal showUpFileModal={showUpFileModal} setShowUpFileModal={setShowUpFileModal} /> : ""}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Penelitian</th>
                            <th>Tahun</th>
                            <th>Peneliti</th>
                            <th>Terlibat</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count<1) ? <tr><td className={styles.noData} colSpan={8}>No data</td></tr> : ""}
                        {dataPenelitian?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul_penelitian}</td>
                                <td>{data.tahun_penelitian}</td>
                                <td>{data.dosen.map(dsn => (dsn.nama_dosen + (data.dosen[data.dosen.length-1].nip!==dsn.nip ? ", " : "")) )}</td>
                                <td>{data.mahasiswa.map(mhs => (mhs.nama_mahasiswa + (data.mahasiswa[data.mahasiswa.length-1].nim!==mhs.nim ? ", " : "")))}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id)}>
                                    <FileIcon />
                                </div></td>
                                <td><Link href={{
                                    pathname: "/data-penelitian/edit-data",
                                    query: {
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
    );
}

export default DataPenelitian