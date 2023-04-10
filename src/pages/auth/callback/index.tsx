import axios from "axios"
import { useEffect } from "react"
import styles from "../../../styles/Loader.module.css"

const index = () => {
    useEffect(() => {
        const windowhref = window.location.href
        const code = windowhref.split("code=")[1]
        console.log(code)

        const formData = new FormData();
        formData.append("code", code);

        const SignIn = async () => {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, formData);
            console.log(res);
        }

        SignIn();
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default index