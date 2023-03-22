import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/PageContent.module.css";

const RekognisiNarsum = () => {
    const [loading, setLoading] = useState<boolean>(false);

    /*
       --- Get All Data Rekognisi dan Narsum ---
    */
    const [dataRekogNarsum, setDataRekogNarsum] = useState([]);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Rekognisi dan Narsum Dosen</div>
                    <Link href="/rekognisi-dan-narsum/add-data" className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload file rekognisi atau Narsum</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading /></div> : ""}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Tahun</th>
                            <th>Dokumen</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default RekognisiNarsum;