import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState, useEffect, useContext } from 'react';
import Modal from "@/components/DeleteModal";
import { TRespPenelitian, TDataPenelitian } from '../../Types/TPenelitian';
import UpFileModal from "@/components/UpFileModal";
import Loading from "@/components/Loading";
import axios from 'axios';
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";

const DataPenelitian = () => {
    const {accessToken} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    /* Get ALl Data Penelitian */
    const [dataPenelitian, setDataPenelitian] = useState<TDataPenelitian[]>();

    useEffect(() => {
        setLoading(true);    

        const getDataPenelitian = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getAllPenelitian`, auth);
                const res:TRespPenelitian = ax.data;
                setCount(res?.count);
                setDataPenelitian(res?.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getDataPenelitian();
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
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/deletePenelitianById/${id}/`
            }).then((res) => setDataPenelitian(dataPenelitian?.filter(d => d.id !== id)))

            count!==undefined ? setCount(count-1) : "";
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
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <div className="add_btn" onClick={() => setShowUpFileModal(true)}>Tambah</div>
                    <div className="tooltip">Upload file penelitian</div>
                </div>

                {loading ? <div className={styles.loadingContainer}><Loading /></div> : "" }

                {showUpFileModal ? <UpFileModal setShowUpFileModal={setShowUpFileModal} currentPage="/data-penelitian" /> : ""}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Penelitian</th>
                            <th>Tahun</th>
                            <th>Peneliti</th>
                            <th>Mahasiswa</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={8}>No data</td></tr> : ""}
                        {dataPenelitian?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul_penelitian}</td>
                                <td>{data.tahun_penelitian}</td>
                                <td>{data.dosen.map(dsn => <p>{dsn.nama + (data.dosen[data.dosen.length-1].nip!==dsn.nip ? "\n" : "")}</p>)}</td>
                                <td className={styles.mhsNameTable}>{data.mahasiswa.map(mhs => <p>{mhs.first_name + (data.mahasiswa[data.mahasiswa.length-1].nim!==mhs.nim ? "; \n" : "")}</p> )}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/penelitian/getFilePenelitianById/")}>
                                    <FileIcon />
                                </div></td>
                                <td><Link href={{
                                    pathname: "/data-penelitian/write-data",
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

export default DataPenelitian