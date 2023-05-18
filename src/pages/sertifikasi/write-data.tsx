import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, MouseEvent, useContext } from "react";
import { TDataSertif, TResp1Sertif } from "./Types";
import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css"
import { UserContext } from "@/context/UserContext";
import { InputDropDownField, InputDropDownTunggal, InputFileField, InputTextField, InputYearField } from "@/components/InputField";
import { TDropDown, TRespDosen } from "../CommonTypes";

const WriteData = () => {
    const {accessToken, nip, role} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    const props = router.query;
    const mode = props.mode;
    const id = props.id;

    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [jenis, setJenis] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const getSertifData = async(id : string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/sertifikat/getSertifikatById/${id}`, auth);
            const res:TResp1Sertif = ax.data;
            const data:TDataSertif = res.data;
            setJudul(data.judul_sertifikat);
            setTahun(data.tahun_sertifikat.toString());
            setJenis(data.jenis_sertifikat);
            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/sertifikat/getFileSertifikatById/${id}`, {
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
            getSertifData(id);
            displayPDF(id);
        }
    }, [id])

    /* getALlDosen -> admin pilih dosen yang mau diinputkan datanya */
    const [dosenData, setDosenData] = useState<TDropDown[]>([]);
    const [chosenNip, setChosenNip] = useState<string>("");
    useEffect(() => {
        const getAllDosen = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getAllDosen`, auth);
            const data:TRespDosen = res.data;
            let dosenDD = [];
            for (let i = 0; i < data.count; i++) {
                dosenDD.push({value: data.data[i].nip, label: data.data[i].nama});
            }
            setDosenData(dosenDD);
        }

        getAllDosen();
    }, [role])

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        if (role === 1) { // jika admin
            formData.append("dosen_nip", chosenNip);
        } else { // jika dosen
            formData.append("dosen_nip", nip);
        }
        formData.append("judul_sertifikat", judul);
        formData.append("tahun_sertifikat", tahun);
        formData.append("jenis_sertifikat", jenis);

        if (id !== "-1") { //in EDIT mode
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/sertifikat/updateSertifikatById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                formData.append("file_sertifikat", filee as any);
    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/sertifikat/addSertifikat`, formData, auth);
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
                    <div className={styles.current_page}>
                        {mode==="edit" ? "Edit" : "Tambah"} Sertifikat Profesi / Dosen
                    </div>
                </div>

                <div className={styles.contents}>
                    {role === 1 ? 
                        <InputDropDownTunggal
                            loading={loading}
                            label="Dosen"
                            optionsData={dosenData}
                            nip={chosenNip}
                            setNip={setChosenNip}
                        />
                        : ""
                    }

                    <InputTextField loading={loading} label="Judul Sertifikat" value={judul} setValue={setJudul} />

                    <InputYearField loading={loading} label="Tahun Sertifikat" value={tahun} setValue={setTahun} />

                    <InputDropDownField loading={loading} label="Jenis Sertifikat" value={jenis} setValue={setJenis} options={[
                        {value: "Sertifikat Profesi", label: "Sertifikat Profesi"},
                        {value: "Sertifikat Dosen", label: "Sertifikat Dosen"}
                    ]} />

                    {mode==="edit" ?
                        <div className={styles.field}>
                            <div className={styles.pdfTop}>
                                <label>File</label>
                                <div className={explVis ? styles.explVis : styles.explHid}>Jika file salah upload, hapuslah data ini dan silahkan mengupload ulang</div>
                            </div>
                            {(loading) ? 
                                <input style={{height: "300px"}} className={loading ? styles.loadingInput : ""} type="text" /> 
                                : 
                                <object className={styles.object} data="" width="100%" height="400px" onMouseOver={() => setExplVis(true)} onMouseLeave={() => setExplVis(false)} />
                            }
                        </div>
                        :
                        <InputFileField label="File Sertifikat" setValue={setFilee}/>
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