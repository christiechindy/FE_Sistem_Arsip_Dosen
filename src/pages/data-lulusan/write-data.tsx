import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataLulusan, TResp1DataLulusan } from "./Types";
import { UserContext } from "@/context/UserContext";
import { InputDropDownTunggal, InputFileField, InputNumberField, InputTextField, InputYearField, UneditableTextField } from "@/components/InputField";
import { TDropDown, TRespDosen } from "../CommonTypes";

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
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/periode_lulusan/updatePeriodeLulusanById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/periode_lulusan/addPeriodeLulusan`, formData, auth);
                console.log(res);
            } catch (err) {
                console.log(err);
            } finally {
                router.back();
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
            </div>
        </Layout>
    )
}

export default WriteData