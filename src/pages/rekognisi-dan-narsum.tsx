import Layout from "@/components/Layout";
import styles from "../styles/PageContent.module.css";

const RekognisiNarsum = () => {
    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Rekognisi dan Narsum Dosen</div>
                    <button className={styles.add_btn}>Tambah</button>
                </div>
                <div className={styles.table}>Here goes the table</div>
            </div>
        </Layout>
    );
}

export default RekognisiNarsum;