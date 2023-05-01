import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { TDataHAKI, TRespHAKI } from "./Types";
import axios from "axios";
import { auth } from "@/utils/token";
import FileIcon from '@/assets/FileIcon';
import PencilIcon from "@/assets/PencilIcon";
import DeleteIcon from "@/assets/DeleteIcon";
import Loading from "@/components/Loading";
import { getToken } from "@/utils/token";

const Haki = () => {
    const [dataHAKI, setDataHAKI] = useState<TDataHAKI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();

    useEffect(() => {
        console.log("dalam useeffect")
        console.log("status loading ", loading)
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

    const fileOpenHandler = async (id: string) => {
        console.log("fileOpenHandler clickesd");
        console.log(id);
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getFileHakiById/${id}`, {
            headers: {Authorization: `Bearer ${getToken()}`},
            responseType: 'blob'
        })
        .then((res) => res.data)
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        })
    }

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
                            <th>Judul HAKI</th>
                            <th>Tahun</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(count<1) ? <tr><td className={styles.noData} colSpan={6}>No data</td></tr> : ""}
                        {dataHAKI?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul_haki}</td>
                                <td>{data.tahun_haki}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id)}>
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
                                <td><div className={styles.iconlink}>
                                    <DeleteIcon />
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Haki;