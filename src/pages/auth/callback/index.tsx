import axios from "axios"
import { useEffect, useContext } from "react"
import styles from "../../../styles/Loader.module.css"
import { TTokenData, TUserData } from "./Types"
import { useRouter } from "next/router"
import { setCookie } from "cookies-next"
import { auth } from "@/utils/token"

const index = () => {
    const router = useRouter();

    useEffect(() => {
        const windowhref = window.location.href
        const code = windowhref.split("code=")[1]
        console.log(code)

        const SignIn = async (code: string, thenwhoistheuser: any) => {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {code})
            .then((res) => res.data)
            .then((data:TTokenData) => {
                setCookie("access_token", data.access_token)
                console.log("success login");
            })

            // setTimeout(() => {
                // thenwhoistheuser();
            // }, 2000);

            thenwhoistheuser(); //pdhl ini thenhome ji iy utk saat ini
        }

        // const WhoIsTheUser = async (thenhome: any) => {
        //     console.log("skrg kt cri who the user is");
        //     await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, auth)
        //     .then((res) => res.data)
        //     .then((data:TUserData) => {
        //         console.log("~-~", data);
        //         setCookie("nama", data.nama)
        //     })

        //     thenhome();
        // }

        SignIn(code, async function() {
            // WhoIsTheUser(function() {
            router.push("/home");
            // })
        });
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default index