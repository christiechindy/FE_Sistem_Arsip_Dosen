import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, ChangeEvent, MouseEvent, useContext } from "react";
import { TDataSertif, TResp1Sertif } from "./Types";
import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css"
import Select from "react-select";
import { UserContext } from "@/context/UserContext";

const WriteData = () => {
    const {accessToken, nip} = useContext(UserContext);
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

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("dosen_nip", nip);
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
                    <div className={styles.field}>
                        <label htmlFor="judul">Judul Sertifikat</label>
                        <input className={loading ? styles.loadingInput : ""} type="text" id="judul" value={judul} onChange={(e: ChangeEvent<HTMLInputElement>) => setJudul(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun Sertifikat</label>
                        <input className={loading ? styles.loadingInput : ""} type="number" id="tahun" value={tahun} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if(e.target.value.length <= 4) {
                                setTahun(e.target.value);
                            }
                        }} />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="jenis">Jenis Sertifikat</label>
                        {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                            <Select
                                options={[
                                    {value: "Sertifikat Profesi", label: "Sertifikat Profesi"},
                                    {value: "Sertifikat Dosen", label: "Sertifikat Dosen"}
                                ]}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        border: state.isFocused ? "1.5px solid #0085FF" : "1.5px solid #dadada",
                                        borderRadius: "10px",
                                        outline: state.isFocused ? "none" : "",
                                        fontSize: "14px",
                                        paddingLeft: "8px",
                                        fontWeight: "400",
                                    }),
                                }}
                                value={{value: jenis, label: jenis}}
                                onChange={(opt) => setJenis(opt!.value)}
                            />
                        </div>}
                    </div>

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
                        <div className={styles.field}>
                            <label htmlFor="file">File</label>
                            <input type="file" id="file" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (!e.target.files) return;
                                setFilee(e.target.files[0])
                            }} />
                        </div>
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