import Image from 'next/image';
import styles from "../styles/Login.module.css";

const index = () => {
    const loginHandler = () => {
        window.open("https://mberkas.unhas.ac.id/oauth/authorize?client_id=11&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=*", "_top");
    }

    return (
        <div className={styles.login_page}>
            <div className={styles.illustration}>
                <Image src="/assets/loginIllustration.svg" width={550} height={550} alt='login'/>
            </div>
            <div className={styles.right}>
                <div className={styles.box}>
                    <Image src="/assets/logo_unhas.png" width={46} height={52} alt="Unhas" />
                    <h1 className={styles.app_name}>Sistem Pengarsipan Dokumen Kerja Dosen</h1>
                    <button className={styles.login_btn} onClick={loginHandler}>Login with MBerkas</button>
                </div>
            </div>
        </div>
    )
}

export default index