import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { TDataKerjaSama, TRespKerjaSama } from "./Types";
import axios from "axios";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import Modal from "@/components/DeleteModal";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { changeDateFormat } from "@/utils/dateFormat";

const KerjaSama = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    if (role === 2) {
        router.push("/home");
    }

    const [dataKerjaSama, setDataKerjaSama] = useState<TDataKerjaSama[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);

        const getAllKerjaSama = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/getAllKerjaSama`, auth);
                const res:TRespKerjaSama = ax.data;
                setCount(res.count);
                setDataKerjaSama(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllKerjaSama();
    }, [])

    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await axios({
            headers: auth.headers,
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/deleteKerjaSamaById/${id}/`
        }).then((res) => setDataKerjaSama(dataKerjaSama?.filter(d => d.id !== id)));

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
                    <div className={styles.current_page}>List Kerja Sama</div>
                    <Link href={{
                        pathname: "/kerja-sama/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }}className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload Data Kerja Sama</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading/></div> : "" }
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Mitra</th>
                            <th>Tanggal</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={6}>No data</td></tr> : ""}
                        {dataKerjaSama?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.mitra}</td>
                                <td>{changeDateFormat(data.tanggal)}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/admin/kerja_sama/getFileKerjaSamaById/")}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/kerja-sama/write-data",
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

export default KerjaSama;