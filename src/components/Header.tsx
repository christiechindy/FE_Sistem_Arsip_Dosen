import styles from "../styles/Header.module.css"

export const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.app_name}>
                Pengarsipan Dokumen Kerja Dosen
            </div>
            <div className={styles.account}>
                Gambar orang nti
            </div>
        </div>
    );
}