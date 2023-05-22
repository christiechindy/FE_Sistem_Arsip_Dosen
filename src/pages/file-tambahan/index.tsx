import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { TDataTambahan, TRespDataTambahan } from "./Types";
import axios from "axios";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import Modal from "@/components/DeleteModal";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";

const FileTambahan = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    if (role === 2) {
        router.push("/home");
    }

    const [dataTambahan, setDataTambahan] = useState<TDataTambahan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);

        const getAllDataTambahan = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/getAllFileTambahan`, auth);
                const res:TRespDataTambahan = ax.data;
                setCount(res.count);
                setDataTambahan(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllDataTambahan();
    }, [])

    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await axios({
            headers: auth.headers,
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/deleteFileTambahanById/${id}/`
        }).then((res) => setDataTambahan(dataTambahan?.filter(d => d.id !== id)));

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
                    <div className={styles.current_page}>List File Tambahan</div>
                    <Link href={{
                        pathname: "/file-tambahan/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }}className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload File Tambahan</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading/></div> : "" }
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Judul</th>
                            <th>Tahun</th>
                            <th>Nomor SK</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={7}>No data</td></tr> : ""}
                        {dataTambahan?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul}</td>
                                <td>{data.tahun}</td>
                                <td>{data.nomor_sk}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/admin/file_tambahan/getFileFileTambahanById/")}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/file-tambahan/write-data",
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

export default FileTambahan;