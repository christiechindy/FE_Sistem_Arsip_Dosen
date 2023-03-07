import Layout from "@/components/Layout"
import styles from "../../styles/Biodata.module.css"

const TambahPenelitian = () => {
    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        Tambah Penelitian
                    </div>
                </div>
                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="judul">Judul Penelitian</label>
                        <input type="text" id="judul" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun</label>
                        <input type="number" id="tahun" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="dosen_peneliti">Dosen Peneliti</label>
                        <input type="text" id="dosen_peneliti" />
                        <button className={styles.add_input}>Add</button>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="mhs_terlibat">Mahasiswa yang Terlibat</label>
                        <input type="text" id="mhs_terlibat" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default TambahPenelitian