import { useRouter } from "next/router"
import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { TDataRekogNarsum, TResp1RekogNarsum } from "./Types";
import axios from "axios";
import styles from "../../styles/PageContent.module.css"
import Layout from "@/components/Layout";
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
        const getRekogNarsumData = async(id : string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/getRekognisiNarsumById/${id}`, auth);
            const res:TResp1RekogNarsum = ax.data;
            const data:TDataRekogNarsum = res.data;
            setJudul(data.judul_rekognisi_narsum);
            setTahun(data.tahun_rekognisi_narsum.toString());
            setJenis(data.jenis_rekognisi_narsum);
            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/getFileRekognisiNarsumById/${id}`, {
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
            getRekogNarsumData(id);
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
        formData.append("judul_rekognisi_narsum", judul);
        formData.append("tahun_rekognisi_narsum", tahun);
        formData.append("jenis_rekognisi_narsum", jenis);

        if (id !== "-1") { //in EDIT mode
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/updateRekognisiNarsumById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                formData.append("file_rekognisi_narsum", filee as any);
    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rekognisi_narsum/addRekognisiNarsum`, formData, auth);
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
                        {mode==="edit" ? "Edit" : "Tambah"} Rekognisi atau Narsum
                    </div>
                </div>

                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="jenis">Jenis</label>
                        {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                            <Select
                                options={[
                                    {value: "Rekognisi", label: "Rekognisi"},
                                    {value: "Narsum", label: "Narsum"}
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

                    <div className={styles.field}>
                        <label htmlFor="judul">Judul {jenis!=="" ? jenis : ""}</label>
                        <input className={loading ? styles.loadingInput : ""} type="text" id="judul" value={judul} onChange={(e: ChangeEvent<HTMLInputElement>) => setJudul(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun {jenis!=="" ? jenis : ""}</label>
                        <input className={loading ? styles.loadingInput : ""} type="number" id="tahun" value={tahun} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if(e.target.value.length <= 4) {
                                setTahun(e.target.value);
                            }
                        }} />
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
    );
    
}

export default WriteData