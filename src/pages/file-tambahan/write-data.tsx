import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataTambahan, TResp1DataTambahan } from "../../Types/TTambahan";
import { UserContext } from "@/context/UserContext";
import { InputFileField, InputTextField, InputYearField } from "@/components/InputField";
import { TError } from "../../Types/CommonTypes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    
    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [noSK, setNoSK] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHakiData = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/getFileTambahanById/${id}`, auth);
            const res:TResp1DataTambahan = ax.data;
            const data:TDataTambahan = res.data;
            setJudul(data?.judul); 
            setTahun(data?.tahun.toString());
            setNoSK(data?.nomor_sk);

            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/getFileFileTambahanById/${id}`, {
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
            getHakiData(id);
            displayPDF(id);
        }
    }, [id])

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("judul", judul);
        formData.append("tahun", tahun);
        formData.append("nomor_sk", noSK);

        if (id !== "-1") { //in EDIT mode
            try {
                toast("Please wait");
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/updateFileTambahanById/${id}`, formData, auth);
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
                formData.append("file", filee as any);
    
                toast("Please wait");
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/file_tambahan/addFileTambahan`, formData, auth);
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

    // state for the explanation tooltip for file
    const [explVis, setExplVis] = useState<boolean>(false);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} File Tambahan</div>
                </div>

                <div className={styles.contents}>
                    <InputTextField loading={loading} label="Judul" value={judul} setValue={setJudul} />

                    <InputYearField loading={loading} label="Tahun" value={tahun} setValue={setTahun}/>

                    <InputTextField loading={loading} label="Nomor SK" value={noSK} setValue={setNoSK} />

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
                <ToastContainer position="bottom-right" />
            </div>
        </Layout>
    )
}

export default WriteData