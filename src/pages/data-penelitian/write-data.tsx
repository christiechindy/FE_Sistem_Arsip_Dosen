import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import XDel from '../../assets/XDel';
import Select from "react-select";
import { useState, MouseEvent, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { TDataOCRScan, TDataPenelitian, TDropDown, TMhsPy, TResp1Penelitian, TRespDosen, TRespMhs } from './Types';
import axios from 'axios';
import { auth, getToken } from "@/utils/token";
import { FileContext } from "@/context/FileContext";
import { InputTextField, InputYearField } from "@/components/InputField";

const TambahPenelitian = () => {
    const router = useRouter();
    const props = router.query;
    const mode = props.mode;
    const id = props.id;

    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [ketuaNip, setKetuaNip] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    /* 
        --- DropDown Dosen ---
    */
    const [dosenData, setDosenData] = useState<TDropDown[]>([]);

    // Get dosen data to display for options
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
    }, [])

    const [dosenFields, setDosenFields] = useState([
        {value: "", label: ""}
    ])

    const handleDosenChange = (nip: string, nama_dosen: string, idx: number) => {
        let data = [...dosenFields];
        data[idx].value = nip;
        data[idx].label = nama_dosen;
        setDosenFields(data);
        console.log(dosenFields);
    }

    const addDosenField = () => {
        setDosenFields([...dosenFields, {value: "", label: ""}])
    }

    const delDosenField = (nip: string) => {
        setDosenFields(dosenFields.filter(dsn => dsn.value !== nip));
    }
    //----------------------------------------------------

    /* 
        --- DropDown Mahasiswa ---
    */
    const [inputValue, setInputValue] = useState<string>("");
    const [mhsData, setMhsData] = useState<TDropDown[]>([]);

    // Get Mhs Data to display for options
    useEffect(() => {
        const getAllMhs = async () => {
            const formData = new FormData();
            formData.append("typed", inputValue);
            console.log("api to search for name typed");
            const res = await axios.post("http://localhost:133/search-mahasiswa", formData);
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
    
    const [mhsFields, setMhsFields] = useState([
        {value: "", label: ""}
    ])

    const handleMhsChange = async (nim: string, nama_mahasiswa: string, idx: number) => {
        let data = [...mhsFields];
        data[idx].value = nim;
        data[idx].label = nama_mahasiswa;
        setMhsFields(data);
    }

    const addMhsField = () => {
        setMhsFields([...mhsFields, {value: "", label: ""}])
    }

    const delMhsField = (nim: string) => {
        setMhsFields(mhsFields.filter(mhs => mhs.value !== nim));
    }

    const handleInputChange = (inputValue: string) => {
        setInputValue(inputValue);
    }
    //----------------------------------------------------

    /*
        --- Get Initial Data ---
    */
   const {fileToScan} = useContext(FileContext);

    useEffect(() => {
        const getOCRData = async () => {
            console.log("getOCRData is called")

            setLoading(true);
            const formData = new FormData();
            formData.append("filee", fileToScan);
            const ax = await axios.post("http://localhost:133/scan-penelitian", formData);
            console.log("ax", ax);
            const data:TDataOCRScan = ax.data;
            console.log("data ocr dari api", data);
            setJudul(data?.judul_penelitian);
            setTahun(data?.tahun_penelitian);
            // setKetuaPenelitian({ value: data.ketua_penelitian.nip, label: data.ketua_penelitian.nama_dosen })
            setKetuaNip(data?.ketua_penelitian.nip);

            const pdf = window.URL.createObjectURL(fileToScan);
            const object = document.querySelector("object");
            if (object?.data) object.data = pdf;

            let dosen = [];
            for (let i = 0; i < data.dosen.length; i++) {
                dosen.push({value: data.dosen[i].nip, label: data.dosen[i].nama_dosen});
            }
            setDosenFields(dosen);

            let mhs = [];
            for (let i = 0; i < data.mahasiswa.length; i++) {
                mhs.push({value: data.mahasiswa[i].nim, label: data.mahasiswa[i].nama_mahasiswa});
            }
            setMhsFields(mhs);

            setLoading(false);
        }

        const getPenelitianData = async (id: string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getPenelitianById/${id}`, auth);
            const res:TResp1Penelitian = ax.data;
            console.log("------", res);
            const data:TDataPenelitian = res.data;
            setJudul(data?.judul_penelitian);
            setTahun(data?.tahun_penelitian.toString());

            let dosen = [];
            for (let i = 0; i < data?.dosen.length; i++) {
                if (data.dosen[i].status === "ketua") {
                    setKetuaNip(data.dosen[i].nip);
                    continue;
                }
                dosen.push({value: data.dosen[i].nip, label: data.dosen[i].nama});
            }
            setDosenFields(dosen);

            let mhs = [];
            for (let i = 0; i < data?.mahasiswa.length; i++) {
                mhs.push({value: data.mahasiswa[i].nim, label: data.mahasiswa[i].nama});
            }
            setMhsFields(mhs);

            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getFilePenelitianById/${id}`, {
                headers: {Authorization: `Bearer ${getToken()}`},
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
            getPenelitianData(id);
            displayPDF(id);
        } else {
            getOCRData();
        }
    }, [id]);
    /*-------------------------------------------------*/

    /* 
        --- Save, Cancel Handler ---
    */
    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async () => {
        const formData = new FormData();
        formData.append("judul_penelitian", judul);
        formData.append("tahun_penelitian", tahun);
        formData.append("ketua_penelitian", ketuaNip);
        
        for (let i = 0; i < dosenFields.length; i++) {
            let key = `dosen_nip[${i}]`;
            formData.append(key, dosenFields[i].value);
        }
        for (let i = 0; i < mhsFields.length; i++) {
            let key = `mahasiswa_nim[${i}]`;
            formData.append(key, mhsFields[i].value);

            const formDataMhs = new FormData();
            formDataMhs.append("nim", mhsFields[i].value);
            formDataMhs.append("nama", mhsFields[i].label);
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/mahasiswa/addMahasiswa`, formDataMhs, auth);
        }

        if (id !== "-1") { // in EDIT mode
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/updatePenelitianById/${id}`, formData, auth);
            } catch (err) {
                console.log(err);
            } finally {
                router.back();
            }
        }
        else { // in ADD mode
            try { 
                formData.append("file_penelitian", fileToScan as any);

                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/addPenelitian`, formData, auth);
                console.log(res);
            } catch (err) {
                console.log(err);
            } finally {
                router.back();
            }
        }
    }
    //----------------------------------------------------

    // state for the explanation tooltip for file
    const [explVis, setExplVis] = useState<boolean>(false);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        {mode==="edit" ? "Edit" : "Tambah"} Penelitian
                    </div>
                </div>

                <div className={styles.contents}>
                    <InputTextField loading={loading} label="Judul Penelitian" value={judul} setValue={setJudul} />

                    <InputYearField loading={loading} label="Tahun" value={tahun} setValue={setTahun}/>

                    <div className={styles.field}>
                        <label>Ketua Peneliti</label>
                        {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                            <Select
                                options={dosenData}
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
                                value={{value: ketuaNip, label: dosenData.find(d => d.value === ketuaNip)?.label}}
                                onChange={(opt) => setKetuaNip(opt!.value)}
                            />
                        </div>}
                    </div>

                    <div className={styles.field}>
                        <label>Dosen Anggota Peneliti</label>
                        {loading ? <input type="text" className={styles.loadingInput} style={{marginBottom: "7px"}} /> : dosenFields.map((input, idx) => (
                            <div className={styles.inputtanPerOrg}>
                                <Select 
                                    options={dosenData}
                                    value={input}
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
                                    onChange={opt => handleDosenChange(opt!.value, opt!.label, idx)}
                                />
                                <div className={styles.delPerson} onClick={() => delDosenField(input.value)}><XDel/></div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.add_input} onClick={addDosenField}>Add</button>

                    <div className={styles.field}>
                        <label>Mahasiswa yang Terlibat</label>
                        {loading ? <input type="text" className={styles.loadingInput} style={{marginBottom: "7px"}} /> : mhsFields.map((input, idx) => (
                            <div className={styles.inputtanPerOrg}>
                                <Select 
                                    options={mhsData}
                                    value={input}
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
                                    onChange={opt => handleMhsChange(opt!.value, opt!.label, idx)}
                                    onInputChange={handleInputChange}
                                />
                                <div className={styles.delPerson} onClick={() => delMhsField(input.value)}><XDel /></div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.add_input} onClick={addMhsField}>Add</button>

                    {mode==="edit" ? 
                        <div className={styles.field}>
                            <div className={styles.pdfTop}>
                                <label>File</label>
                                <div className={explVis ? styles.explVis : styles.explHid}>Jika file salah upload, silahkan kembali ke halaman sebelumnya dan mengupload ulang</div>
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
                            <object className={styles.object} data="" width="100%" height="400px"/>
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

export default TambahPenelitian