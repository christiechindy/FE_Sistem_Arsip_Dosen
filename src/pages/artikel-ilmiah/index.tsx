import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { TDataArtIlmiah, TRespArtIlmiah } from "./Types";
import axios from "axios";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import Modal from "@/components/DeleteModal";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";

const ArtikelIlmiah = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [dataArtIlmiah, setDataArtIlmiah] = useState<TDataArtIlmiah[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);

        const getAllArtIlmiah = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/artikel_ilmiah/getAllArtikelIlmiah`, auth);
                const res:TRespArtIlmiah = ax.data;
                setCount(res.count);
                setDataArtIlmiah(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllArtIlmiah();
    }, [])

    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await axios({
            headers: auth.headers,
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/artikel_ilmiah/deleteArtikelIlmiahById/${id}/`
        }).then((res) => setDataArtIlmiah(dataArtIlmiah?.filter(d => d.id !== id)));

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
                    <div className={styles.current_page}>List Artikel Ilmiah</div>
                    <Link href={{
                        pathname: "/artikel-ilmiah/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }} className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload Data Artikel Ilmiah</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading/></div> : "" }
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            {role===1 ? <th>Nama Dosen</th> : ""}
                            <th>Judul Artikel Ilmiah</th>
                            <th>Vol, No, Tahun</th>
                            <th>Nama Jurnal</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={role===2 ? 7 : 8}>No data</td></tr> : ""}
                        {dataArtIlmiah?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                {role===1 ? <td>{data.dosen?.nama}</td> : ""}
                                <td>{data.judul_artikel_ilmiah}</td>
                                <td>{data.vnt}</td>
                                <td>{data.nama_jurnal}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/artikel_ilmiah/getFileArtikelIlmiahById/")}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/artikel-ilmiah/write-data",
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

export default ArtikelIlmiah;