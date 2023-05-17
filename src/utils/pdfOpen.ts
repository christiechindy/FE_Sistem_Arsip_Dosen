import axios from "axios";
import { getToken } from "./token";

export const fileOpenHandler = async (id: string, url: string) => {
    console.log("fileOpenHandler clickesd");
    console.log(id);

    const api_path:string = process.env.NEXT_PUBLIC_BASE_URL + url + id;

    await axios.get(api_path, {
        headers: {Authorization: `Bearer ${getToken()}`},
        responseType: 'blob'
    })
    .then((res) => res.data)
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    })
    .catch(err => console.log(err))
}