import axios from "axios"
import { useEffect } from "react"


const index = () => {
    useEffect(() => {
        const windowhref = window.location.href
        const code = windowhref.split("code=")[1]
        console.log(code)

        const formData = new FormData();
        formData.append("code", code);

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`, {
            method: "POST",
            // credentials: "include",
            headers: {
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Content-Type": "multipart/form-data"
            },
            body: code
        }).then((res) => console.log(res))

        // const postCode = async () => {
        //     const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`, code);
        //     console.log("rest in peace", res);
        // }

        // postCode();
    }, [])

    return (
        <div>index</div>
    )
}

export default index