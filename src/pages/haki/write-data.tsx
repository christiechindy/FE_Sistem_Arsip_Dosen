import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, ChangeEvent, useEffect } from "react"
import axios from "axios";
import { auth, getToken } from "@/utils/token";
import { useRouter } from "next/router";
import { TData1HAKI, TResp1HAKI } from "./Types";

const WriteData = () => {
    const router = useRouter();
    const props = router.query;
    const mode = props.mode;
    const id = props.id;
    
    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHakiData = async (id: string | string[] | undefined, thenDisplayPDF: any) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getHakiById/${id}`, auth);
            const res:TResp1HAKI = ax.data;
            const data:TData1HAKI = res.data;
            setJudul(data.judul_haki);
            setTahun(data.tahun_haki.toString());
            setLoading(false);

            thenDisplayPDF();
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/getFileHakiById/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                cache: "default",
            })
            .then((res) => res.blob())
            .then((blob) => {
                const pdf = window.URL.createObjectURL(blob);
                const object = document.querySelector("object");
                if (object?.data) object.data = pdf;
            })
            .catch(err => console.log(err))
        }

        if (id !== "-1") {
            getHakiData(id, async function() {
                displayPDF(id);
            });
        }
    }, [id])

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
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/updateHakiById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                formData.append("file_haki", filee as any);
    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/haki/addHaki`, formData, auth);
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
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} HAKI</div>
                </div>

                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="judul">Judul HAKI</label>
                        <input className={loading ? styles.loadingInput : ""} type="text" id="judul" value={judul} onChange={(e: ChangeEvent<HTMLInputElement>) => setJudul(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun</label>
                        <input className={loading ? styles.loadingInput : ""} type="number" id="tahun" value={tahun} onChange={(e: ChangeEvent<HTMLInputElement>) => setTahun(e.target.value)} />
                    </div>

                    {mode==="edit" ? 
                        <div className={styles.field}>
                            <div className={styles.pdfTop}>
                                <label>File</label>
                                <div className={explVis ? styles.explVis : styles.explHid}>Jika file salah upload, hapuslah data ini dan silahkan mengupload ulang</div>
                            </div>
                            <object className={styles.object} data="" width="100%" height="400px" onMouseOver={() => setExplVis(true)} onMouseLeave={() => setExplVis(false)} />
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