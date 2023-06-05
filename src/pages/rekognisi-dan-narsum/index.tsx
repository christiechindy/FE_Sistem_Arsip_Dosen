import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "../../styles/PageContent.module.css";
import { TDataRekogNarsum, TRespRekogNarsum } from './Types';
import axios from "axios";
import { fileOpenHandler } from "@/utils/pdfOpen";
import FileIcon from "@/assets/FileIcon";
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Modal from "@/components/DeleteModal";
import { UserContext } from "@/context/UserContext";

const RekognisiNarsum = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    /*
       --- Get All Data Rekognisi dan Narsum ---
    */
    const [dataRekogNarsum, setDataRekogNarsum] = useState<TDataRekogNarsum[]>([]);

    useEffect(() => {
        setLoading(true);

        const getAllRekogNarsum = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/getAllRekognisiNarsum`, auth);
                const res:TRespRekogNarsum = ax.data;
                setCount(res.count);
                setDataRekogNarsum(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllRekogNarsum();
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
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/deleteRekognisiNarsumById/${id}`
            })
            .then((res) => setDataRekogNarsum(dataRekogNarsum?.filter(d => d.id !== id)))

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

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Rekognisi dan Narsum Dosen</div>
                    <Link href={{
                        pathname: "/rekognisi-dan-narsum/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }} className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload file rekognisi atau Narsum</div>
                </div>

                {loading ? <div className={styles.loadingContainer}><Loading /></div> : ""}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            {role === 1 ? <th>Nama Dosen</th> : ""}
                            <th>Judul</th>
                            <th>Tahun</th>
                            <th>Jenis</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={role === 2 ? 7 : 8}>No data</td></tr> : ""}
                        {dataRekogNarsum?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                {role === 1 ? <td>{data.dosen?.nama}</td> : ""}
                                <td>{data.judul_rekognisi_narsum}</td>
                                <td>{data.tahun_rekognisi_narsum}</td>
                                <td>{data.jenis_rekognisi_narsum}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/rekognisi_narsum/getFileRekognisiNarsumById/")}>
                                    <FileIcon />
                                </div></td>
                                <td><Link href={{
                                    pathname: "/rekognisi-dan-narsum/write-data",
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

export default RekognisiNarsum;