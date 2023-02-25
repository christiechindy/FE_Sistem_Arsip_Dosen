import Image from 'next/image';
import styles from "../styles/Login.module.css";
import Link from 'next/link';

const index = () => {
    return (
        <div className={styles.login_page}>
            <div className={styles.illustration}>
                <Image src="/assets/loginIllustration.svg" width={550} height={550} alt='login'/>
            </div>
            <div className={styles.right}>
                <div className={styles.box}>
                    <Image src="/assets/logo_unhas.png" width={46} height={52} alt="Unhas" />
                    <h1 className={styles.app_name}>Sistem Pengarsipan Dokumen Kerja Dosen</h1>
                    <Link href="/" className={styles.login_btn}>Login with MBerkas</Link>
                </div>
            </div>
        </div>
    )
}

export default index