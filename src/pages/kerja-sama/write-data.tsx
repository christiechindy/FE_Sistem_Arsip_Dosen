import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataKerjaSama, TResp1KerjaSama } from "./Types";
import { UserContext } from "@/context/UserContext";
import { InputFileField, InputMonthYearField, InputTextField } from "@/components/InputField";

const WriteData = () => {
    const {accessToken, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    if (role === 2) {
        router.push("/home");
    }

    const props = router.query;
    const mode = props.mode;
    const id = props.id;
    
    const [mitra, setMitra] = useState<string>("");
    const [tanggal, setTanggal] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getKerjaSama = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/getKerjaSamaById/${id}`, auth);
            const res:TResp1KerjaSama = ax.data;
            const data:TDataKerjaSama = res.data;
            setMitra(data?.mitra);
            setTanggal(data?.tanggal);
            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/getFileKerjaSamaById/${id}`, {
                headers: auth.headers,
                responseType: 'blob'
            })
            .then((res) => res.data)
            .then((blob) => {
                const pdf = window.URL.createObjectURL(blob);
                const object = document.querySelector("object");
                if (object?.data) object.data = pdf;
            })
            .catch(err => console.log(err))
        }

        if (id !== "-1") {
            getKerjaSama(id);
            displayPDF(id);
        }
    }, [id])

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("mitra", mitra);
        formData.append("tanggal", tanggal);

        if (id !== "-1") { //in EDIT mode
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/updateKerjaSamaById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                formData.append("file", filee as any);
    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kerja_sama/addKerjaSama`, formData, auth);
                console.log(res);
            } catch (err) {
                console.log(err);
            } finally {
                router.back();
            }
        }        
    }

    // state for the explanation tooltip for file
    const [explVis, setExplVis] = useState<boolean>(false);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} Kerja Sama</div>
                </div>

                <div className={styles.contents}>
                    <InputTextField loading={loading} label="Mitra Kerja Sama" value={mitra} setValue={setMitra} />

                    <InputMonthYearField loading={loading} label="Tanggal (bulan, tahun)" value={tanggal} setValue={setTanggal} />

                    {mode==="edit" ? 
                        <div className={styles.field}>
                            <div className={styles.pdfTop}>
                                <label>File</label>
                                <div className={explVis ? styles.explVis : styles.explHid}>Jika file salah upload, hapuslah data ini dan silahkan mengupload ulang</div>
                            </div>
                            {(loading) ? <input style={{height: "300px"}} className={styles.loadingInput} type="text" /> : <object className={styles.object} data="" width="100%" height="400px" onMouseOver={() => setExplVis(true)} onMouseLeave={() => setExplVis(false)} />}
                        </div>
                        :
                        <InputFileField label="File" setValue={setFilee} />
                    }

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