import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { TDataLomba, TRespDataLomba } from "../../Types/TLombaMhs";
import axios from "axios";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import Modal from "@/components/DeleteModal";
import { fileOpenHandler } from "@/utils/pdfOpen";
import { UserContext } from "@/context/UserContext";
import { changeDateFormat } from "@/utils/dateFormat";
import { useRouter } from "next/router";

const LombaMhs = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    if (role === 2) {
        router.push("/home");
    }

    const [dataLomba, setDataLomba] = useState<TDataLomba[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        setLoading(true);

        const getAllLombaMhs = async () => {
            try {
                const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/getAllLomba`, auth);
                const res:TRespDataLomba = ax.data;
                setCount(res.count);
                setDataLomba(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getAllLombaMhs();
    }, [])

    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await axios({
            headers: auth.headers,
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/deleteLombaById/${id}/`
        }).then((res) => setDataLomba(dataLomba?.filter(d => d.id !== id)));

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
                    <div className={styles.current_page}>List Lomba Mahasiswa</div>
                    <Link href={{
                        pathname: "/lomba-mhs/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }}className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload Data Lomba Mahasiswa</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading/></div> : "" }
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Mhs</th>
                            <th>Nama Lomba</th>
                            <th>Penyelenggara</th>
                            <th>Tanggal</th>
                            <th>Sertifikat</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count!<1) ? <tr><td className={styles.noData} colSpan={7}>No data</td></tr> : ""}
                        {dataLomba?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td style={{textTransform: "capitalize"}}>{data.mahasiswa![0].first_name + " " + data.mahasiswa![0].last_name}</td>
                                <td>{data.nama_lomba}</td>
                                <td>{data.penyelenggara}</td>
                                <td>{changeDateFormat(data.start_date) + " - " + changeDateFormat(data.end_date)}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id, "/api/v1/lomba/getFileLombaById/")}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/lomba-mhs/write-data",
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

export default LombaMhs;