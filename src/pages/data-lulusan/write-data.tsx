import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataLulusan, TResp1DataLulusan } from "./Types";
import { UserContext } from "@/context/UserContext";
import { InputDropDownTunggal, InputFileField, InputNumberField, InputTextField, InputYearField, UneditableTextField } from "@/components/InputField";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TError } from "../CommonTypes";

const WriteData = () => {
    const {accessToken, nip, role} = useContext(UserContext);
    const router = useRouter();
    if (role === 2) {
        router.push("/home");
    }

    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const props = router.query;
    const mode = props.mode;
    const id = props.id;
    
    const [jumlah, setJumlah] = useState<number>();
    const [periode, setPeriode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getLulusanData = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/periode_lulusan/getPeriodeLulusanById/${id}`, auth);
            const res:TResp1DataLulusan = ax.data;
            const data:TDataLulusan = res.data;
            setJumlah(data?.jumlah);
            setPeriode(data?.periode);
            setLoading(false);
        }

        if (id !== "-1") {
            getLulusanData(id);
        }
    }, [id])

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("jumlah", String(jumlah));
        formData.append("periode", periode);

        if (id !== "-1") { //in EDIT mode
            try {
                toast("Please wait");
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/periode_lulusan/updatePeriodeLulusanById/${id}`, formData, auth);
                if (res.data.status !== "OK") {
                    toast.error(res.data.status +" "+ JSON.stringify(res.data.message))
                } else {
                    router.back();
                }
            } catch(err) {
                const error = err as TError;
                if (error.response.data.status !== "OK") {
                    toast.error(error.response.data.status +" "+ JSON.stringify(error.response.data.message))
                }
            }
        } 
        else { //in ADD mode
            try {
                toast("Please wait");
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/periode_lulusan/addPeriodeLulusan`, formData, auth);
                if (res.data.status !== "OK") {
                    toast.error(res.data.status +" "+ JSON.stringify(res.data.message))
                } else {
                    router.back();
                }
            } catch (err) {
                const error = err as TError;
                if (error.response.data.status !== "OK") {
                    toast.error(error.response.data.status +" "+ JSON.stringify(error.response.data.message))
                }
            }
        }        
    }

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} Data Lulusan</div>
                </div>

                <div className={styles.contents}>
                    <InputTextField loading={loading} label="Periode Lulusan" value={periode} setValue={setPeriode} />

                    <InputNumberField loading={loading} label="Jumlah Lulusan" value={jumlah!} setValue={setJumlah} />

                    <div className={styles.action_btn}>
                        <button className={styles.cancel} onClick={cancelHandler}>Cancel</button>
                        <button className={styles.save} onClick={saveHandler}>Save</button>
                    </div>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        </Layout>
    )
}

export default WriteData