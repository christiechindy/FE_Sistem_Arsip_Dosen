import Layout from "@/components/Layout";
import styles from "../../styles/Biodata.module.css";

const Biodata = () => {
    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        Biodata
                    </div>
                    <button className={styles.sister}>Sinkronisasi Sister</button>
                </div>
                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="nama">Nama Lengkap</label>
                        <input type="text" id="nama" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tgl_lahir">Tanggal Lahir</label>
                        <input type="date" id="tgl_lahir" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="nip">NIP</label>
                        <input type="text" id="nip" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="pangkat">Pangkat / Golongan</label>
                        <input type="text" id="pangkat" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="pendidikan">Riwayat Pendidikan</label>
                        <div className={styles.box_riwayat} id="pendidikan">
                            <div className={styles.field}>
                                <label htmlFor="S...">Sarjana</label>
                                <select name="sarjana" id="S...">
                                    <option value="S1">S1</option>
                                    <option value="S2">S2</option>
                                    <option value="S3">S3</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="kampus">Nama Kampus</label>
                                <input type="text" id="kampus" required />
                            </div>
                            <div className={styles.field}>
                                <div className={styles.field}>
                                    <label htmlFor="fakultas">Fakultas</label>
                                    <input type="text" id="fakultas" />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="prodi">Program Studi</label>
                                    <input type="text" id="prodi" />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="tahun">Tahun Kelulusan</label>
                                <input type="number" id="tahun" />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="ijazah">Ijazah</label>
                                <input type="file" id="ijazah" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Biodata;