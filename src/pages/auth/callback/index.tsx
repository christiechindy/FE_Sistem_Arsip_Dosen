import axios from "axios"
import { useEffect, useContext } from "react"
import styles from "../../../styles/Loader.module.css"
import { TTokenData } from "./Types"
import { useRouter } from "next/router"
import { setCookie } from "cookies-next"
import { UserContext } from "@/context/UserContext"

const index = () => {
    const router = useRouter();
    const {setAccessToken} = useContext(UserContext);

    useEffect(() => {
        const windowhref = window.location.href
        const code = windowhref.split("code=")[1]
        console.log(code)

        const SignIn = async (code: string) => {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {code})
            .then((res) => res.data)
            .then((data:TTokenData) => {
                setCookie("access_token", data.access_token)
                setAccessToken(data.access_token);
                console.log("success login");
            })
        }

        SignIn(code).then(() => router.push("/home"));
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default index