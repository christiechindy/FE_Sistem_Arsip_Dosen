import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState, useEffect, useContext } from 'react';
import Modal from "@/components/DeleteModal";
import { TRespPengabdian, TDataPengabdian } from './Types';
import UpFileModal from "@/components/UpFileModal";
import Loading from "@/components/Loading";
import axios from 'axios';
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";

const DataPengabdian = () => {
    const {accessToken} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    /* Get ALl Data Pengabdian */
    const [dataPengabdian, setDataPengabdian] = useState<TDataPengabdian[]>();

    useEffect(() => {
        setLoading(true);    

        const getDataPengabdian = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pengabdian/getAllPengabdian`, auth);
                const res:TRespPengabdian = ax.data;
                setCount(res?.count);
                setDataPengabdian(res?.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getDataPengabdian();
    }, [])

    /* Delete a research data */
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        try {
            await axios({
                headers: auth.headers,
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pengabdian/deletePengabdianById/${id}/`
            }).then((res) => setDataPengabdian(dataPengabdian?.filter(d => d.id !== id)))

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

    /* File Modal */
    const [showUpFileModal, setShowUpFileModal] = useState<boolean>(false);

    /*------------------------------------------*/

    return (
        <Layout> 
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Pengabdian</div>
                    <div className="add_btn" onClick={() => setShowUpFileModal(true)}>Tambah</div>
                    <div className="tooltip">Upload file pengabdian</div>
                </div>

                {loading ? <div className={styles.loadingContainer}><Loading /></div> : "" }

                {showUpFileModal ? <UpFileModal setShowUpFileModal={setShowUpFileModal} currentPage="/data-pengabdian" /> : ""}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Pengabdian</th>
                            <th>Tahun</th>
                            <th>Dosen Pengabdi</th>
                            <th>Mahasiswa</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={8}>No data</td></tr> : ""}
                        {dataPengabdian?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul_pengabdian}</td>
                                <td>{data.tahun_pengabdian}</td>
                                <td>{data.dosen.map(dsn => <p>{dsn.nama + (data.dosen[data.dosen.length-1].nip!==dsn.nip ? "\n" : "")}</p>)}</td>
                                <td>{data.mahasiswa.map(mhs => <p>{mhs.first_name + (data.mahasiswa[data.mahasiswa.length-1].nim!==mhs.nim ? "; \n" : "")}</p> )}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/pengabdian/getFilePengabdianById/")}>
                                    <FileIcon />
                                </div></td>
                                <td><Link href={{
                                    pathname: "/data-pengabdian/write-data",
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
    );
}

export default DataPengabdian