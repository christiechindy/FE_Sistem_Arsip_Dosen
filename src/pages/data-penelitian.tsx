'use client';

import Layout from "@/components/Layout";
import styles from "../styles/PageContent.module.css";

const DataPenelitian = () => {
    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <button className={styles.add_btn}>Tambah</button>
                    <div className={styles.tooltip}>Upload file penelitian</div>
                </div>
                <table className={styles.table}>
                    <tr>
                        <th>Nama Penelitian</th>
                        <th>Tahun</th>
                        <th>Peneliti</th>
                        <th>Yang terlibat</th>
                        <th>File</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    <tr>
                        <td>Prediksi Harga Bitcoin 5 Tahun ke Depan</td>
                        <td>2020</td>
                        <td>Prof. Bay, Pak Iqra Aswad, M.T.</td>
                        <td>Fauzan Adithya</td>
                        <td>Ic</td>
                        <td>Ic</td>
                        <td>Ic</td>
                    </tr>
                    <tr>
                        <td>Prediksi Harga Bitcoin 5 Tahun ke Depan</td>
                        <td>2020</td>
                        <td>Prof. Bay, Pak Iqra Aswad, M.T.</td>
                        <td>Fauzan Adithya</td>
                        <td>Ic</td>
                        <td>Ic</td>
                        <td>Ic</td>
                    </tr>
                </table>
            </div>
        </Layout>
    );
}

export default DataPenelitian;