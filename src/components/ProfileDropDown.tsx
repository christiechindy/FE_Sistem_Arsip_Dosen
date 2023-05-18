import { useRouter } from "next/router";
import styles from "../styles/Header.module.css"
import { deleteCookie } from "cookies-next";

const ProfileDropDown = () => {
    const router = useRouter();

    const LogOutHandler = () => {
        deleteCookie("access_token");
        deleteCookie("profile_name");
        deleteCookie("nip");
        router.push("/login");
    }

    return (
        <div className={styles.box}>
            <div className={styles.opt}>Generate CV</div>
            <div className={styles.opt} onClick={LogOutHandler}>Log out</div>
        </div>
    )
}

export default ProfileDropDown