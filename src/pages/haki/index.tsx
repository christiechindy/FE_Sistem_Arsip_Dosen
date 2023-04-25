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

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List HAKI</div>
                    <Link href="/haki/write-data" className="add_btn">Tambah</Link>
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
                                <td><div className={styles.iconlink}>
                                    <FileIcon/>
                                </div></td>
                                <td><Link href={{
                                    pathname: "/haki/write-data"
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