import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { TDataHAKI, TRespHAKI } from "./Types";
import axios from "axios";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import Modal from "@/components/DeleteModal";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";

const Haki = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [dataHAKI, setDataHAKI] = useState<TDataHAKI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);

        const getAllHAKI = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getAllHaki`, auth);
                const res:TRespHAKI = ax.data;
                setCount(res.count);
                setDataHAKI(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllHAKI();
    }, [])

    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await axios({
            headers: auth.headers,
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/deleteHakiById/${id}/`
        }).then((res) => setDataHAKI(dataHAKI?.filter(d => d.id !== id)));

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

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List HAKI</div>
                    <Link href={{
                        pathname: "/haki/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }} className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload Data HAKI</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading/></div> : "" }
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            {role===1 ? <th>Nama Dosen</th> : ""}
                            <th>Judul HAKI</th>
                            <th>Tahun</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count<1) ? <tr><td className={styles.noData} colSpan={role===2 ? 6 : 7}>No data</td></tr> : ""}
                        {dataHAKI?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                {role===1 ? <td>{data.dosen?.nama}</td> : ""}
                                <td>{data.judul_haki}</td>
                                <td>{data.tahun_haki}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/haki/getFileHakiById/")}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/haki/write-data",
                                    query: {
                                        mode: "edit",
                                        id: data.id,
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
                {showDelModal ? <Modal showDelModal={showDelModal} setShowDelModal={setShowDelModal} setSure_to_del={setSure_to_del}/> : ""}
            </div>
        </Layout>
    );
}

export default Haki;