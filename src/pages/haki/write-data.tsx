import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataHAKI, TResp1HAKI } from "../../Types/THaki";
import { UserContext } from "@/context/UserContext";
import { InputDropDownTunggal, InputFileField, InputTextField, InputYearField, UneditableTextField } from "@/components/InputField";
import { TDropDown, TError, TRespDosen } from "../../Types/CommonTypes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WriteData = () => {
    const {accessToken, nip, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    const props = router.query;
    const mode = props.mode;
    const id = props.id;
    
    const [whose, setWhose] = useState<string>("");
    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHakiData = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getHakiById/${id}`, auth);
            const res:TResp1HAKI = ax.data;
            const data:TDataHAKI = res.data;
            setJudul(data?.judul_haki); //ksh data?. nanti smua spy biar di refresh tdk error
            setTahun(data?.tahun_haki.toString());
            if (role === 1) {
                setWhose(data?.dosen?.nama!);
            }

            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getFileHakiById/${id}`, {
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

    /* getALlDosen -> admin pilih dosen yang mau diinputkan datanya */
    const [dosenData, setDosenData] = useState<TDropDown[]>([]);
    const [chosenNip, setChosenNip] = useState<string>("");
    useEffect(() => {
        const getAllDosen = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getAllDosen`, auth);
            const data:TRespDosen = res?.data;
            let dosenDD = [];
            for (let i = 0; i < data.count; i++) {
                dosenDD.push({value: data.data[i].nip, label: data.data[i].nama});
            }
            setDosenData(dosenDD);
        }

        if (mode === "add" && role === 1) {
            getAllDosen();
        }
    }, [role])

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("judul_haki", judul);
        formData.append("tahun_haki", tahun);

        if (id !== "-1") { //in EDIT mode
            try {
                toast("Please wait");    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/updateHakiById/${id}`, formData, auth);
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
                if (role === 1) { // jika admin
                    formData.append("dosen_nip", chosenNip);
                } else { // jika dosen
                    formData.append("dosen_nip", nip);
                }
                formData.append("file_haki", filee as any);
    
                toast("Please wait");
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/addHaki`, formData, auth);
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
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} HAKI</div>
                </div>

                <div className={styles.contents}>
                    {role === 1 && mode === "add" ? 
                        <InputDropDownTunggal
                            loading={loading}
                            label="Dosen"
                            optionsData={dosenData}
                            nip={chosenNip}
                            setNip={setChosenNip}
                        />
                        : ""
                    }

                    {role === 1 && mode === "edit" ? 
                        <UneditableTextField loading={loading} label="Nama Dosen" value={whose!} />
                        : ""
                    }

                    <InputTextField loading={loading} label="Judul HAKI" value={judul} setValue={setJudul} />

                    <InputYearField loading={loading} label="Tahun" value={tahun} setValue={setTahun}/>

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