import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useState, MouseEvent, useEffect, useContext, ChangeEvent } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import { TDataLomba, TDokumentasi, TResp1DataLomba } from "./Types";
import { UserContext } from "@/context/UserContext";
import { InputDateRangeField, InputDropDownMahasiswaTunggal, InputDropDownTunggal, InputFileField, InputTextField, UneditableTextField } from "@/components/InputField";
import { TDropDown, TError, TMhsPy, TRespDosen } from "../CommonTypes";
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
    
    const [whose, setWhose] = useState<string>("");
    const [namaLomba, setNamaLomba] = useState<string>("");
    const [penyelenggara, setPenyelenggara] = useState<string>("");
    const [startLomba, setStartLomba] = useState<string>("");
    const [endLomba, setEndLomba] = useState<string>("");
    const [certif, setCertif] = useState<File | null>(null);
    const [imgs, setImgs] = useState<TDokumentasi[] | FileList>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getLombaMhsData = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/getLombaById/${id}`, auth);
            const res:TResp1DataLomba = ax.data;
            const data:TDataLomba = res.data;
            setWhose(data?.mahasiswa![0].first_name + " " + data?.mahasiswa![0].last_name);
            setNamaLomba(data?.nama_lomba);
            setPenyelenggara(data?.penyelenggara);
            setStartLomba(data?.start_date);
            setEndLomba(data?.end_date);
            setImgs(data?.dokumentasi);
            
            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            console.log("dipanggil ji displayPDF")
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/getFileLombaById/${id}`, {
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
            getLombaMhsData(id);
            displayPDF(id);
        }
    }, [id])

    /* 
        --- DropDown Mahasiswa ---
    */
    const [inputValue, setInputValue] = useState<string>("");
    const [mhsData, setMhsData] = useState<TDropDown[]>([]);
    const [chosenNim, setChosenNim] = useState<string>("");
    const [chosenName, setChosenName] = useState<string>("");

    // Get Mhs Data to display for options
    useEffect(() => {
        const getAllMhs = async () => {
            const formData = new FormData();
            formData.append("typed", inputValue);
            console.log("api to search for name typed");
            console.log("envvvvvvvvvvvvvvvvvvvvvv", process.env.NEXT_PUBLIC_PYTHON);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_PYTHON}/search-mahasiswa`, formData);
            const data:TMhsPy[] = res.data;
            let mhsDD = [];
            for (let i = 0; i < data.length; i++) {
                mhsDD.push({value: data[i].nim, label: data[i].nama_mahasiswa});
            }
            setMhsData(mhsDD);
        }

        if (inputValue.length >= 3) {
            getAllMhs();
        }
    }, [inputValue])

    const handleInputChange = (inputValue: string) => {
        setInputValue(inputValue);
    }
    //-----------------------------------------------

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("nama_lomba", namaLomba);
        formData.append("penyelenggara", penyelenggara);
        formData.append("start_date", startLomba);
        formData.append("end_date", endLomba);

        if (id !== "-1") { //in EDIT mode
            try {
                toast("Please wait");    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/updateLombaById/${id}`, formData, auth);
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
                // add Mhs nya dlu
                const formDataMhs = new FormData();
                formDataMhs.append("nim", chosenNim);
                formDataMhs.append("first_name", chosenName);
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/mahasiswa/addMahasiswa`, formDataMhs, auth).then(async () => {
                    formData.append("mahasiswa_nim[0]", chosenNim);
                    formData.append("file_lomba", certif as any);
                    for (let i = 0; i < imgs!.length; i++) {
                        let key = `file_dokumentasi_lomba[${i}]`;
                        formData.append(key, imgs![i] as any);
                    }
        
                    toast("Please wait");
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/lomba/addLomba`, formData, auth);
                    if (res.data.status !== "OK") {
                        toast.error(res.data.status +" "+ JSON.stringify(res.data.message))
                    } else {
                        router.back();
                    }
                })
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
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} Data Lomba Mahasiswa</div>
                </div>

                <div className={styles.contents}>
                    {role === 1 && mode === "add" ? 
                        <InputDropDownMahasiswaTunggal
                            loading={loading}
                            mhsData={mhsData}
                            handleInputChange={handleInputChange}
                            nim={chosenNim}
                            setNim={setChosenNim}
                            setName={setChosenName} />
                        : ""
                    }

                    {role === 1 && mode === "edit" ? 
                        <UneditableTextField loading={loading} label="Nama Mahasiswa" value={whose!} />
                        : ""
                    }

                    <InputTextField loading={loading} label="Nama Lomba" value={namaLomba} setValue={setNamaLomba} />

                    <InputTextField loading={loading} label="Penyelenggara" value={penyelenggara} setValue={setPenyelenggara} />

                    <InputDateRangeField loading={loading} label="Tanggal Lomba" start={startLomba} setStart={setStartLomba} end={endLomba} setEnd={setEndLomba} /> 

                    {mode==="edit" ? 
                        <>
                            <div className={styles.field}>
                                <div className={styles.pdfTop}>
                                    <label>Sertifikat Lomba (PDF)</label>
                                    <div className={explVis ? styles.explVis : styles.explHid}>Jika file salah upload, hapuslah data ini dan silahkan mengupload ulang</div>
                                </div>
                                {(loading) ? <input style={{height: "300px"}} className={styles.loadingInput} type="text" /> : <object className={styles.object} data="" width="100%" height="400px" onMouseOver={() => setExplVis(true)} onMouseLeave={() => setExplVis(false)} />}
                            </div>

                            <div className={styles.field}>
                                <div className={styles.pdfTop}>
                                    <label>Gambar Dokumentasi Lomba</label>
                                </div>
                                {(loading) ? 
                                    <input style={{height: "300px"}} className={styles.loadingInput} type="text" /> 
                                    : 
                                    <div className={styles.gbrLombaContainer}>
                                        {/* @ts-ignore */}
                                        {imgs?.map((gbr: TDokumentasi) => (
                                            <img className={styles.gbrLomba} src={`${process.env.NEXT_PUBLIC_BASE_URL}/dokumentasic_lomba/${id}/${gbr.file_dokumentasi_lomba}`} alt="dokumentasi lomba" />
                                        ))}
                                    </div>
                                }
                            </div>
                        </>
                        :
                        <>
                            <InputFileField label="File" setValue={setCertif} />

                            <div className={styles.field}>
                                <label>Gambar Dokumentasi Lomba</label>
                                <input type="file" multiple onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    if (!e.target.files) return;
                                    setImgs((e.target.files));
                                }}/>
                            </div>
                        </>
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