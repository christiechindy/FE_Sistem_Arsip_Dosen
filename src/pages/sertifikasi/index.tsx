import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../styles/PageContent.module.css";
import { TDataSertif } from './Types';

const SertifikatProfesi = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>();
    const [dataSertif, setDataSertif] = useState<TDataSertif[]>([]);
    
    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/`)
    // }, [])
    
    return (
        <>
            <Layout>
                <div className={styles.page}>
                    <div className={styles.top}>
                        <div className={styles.current_page}>List Sertifikat Profesi dan Serdos</div>
                        <Link href="/sertifikasi/add-data" className="add_btn">Tambah</Link>
                        <div className="tooltip">Upload sertifikat profesi atau serdos</div>
                    </div>
                    {loading ? <div className={styles.loadingContainer}><Loading/></div> : ""}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>Jenis</th>
                                <th>File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {(count<1) ? <tr><td className={styles.noData} colSpan={4}>No data</td></tr> : ""} */}

                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    );
}

export default SertifikatProfesi;