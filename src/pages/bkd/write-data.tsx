"use client";

import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useContext } from "react";
import {useState, useEffect} from 'react';
import axios from "axios";
import { TDataBKD, TResp1BKD } from "./Types";
import Select from "react-select";
import { UserContext } from "@/context/UserContext";

const AddData = () => {
    const {accessToken, nip} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const router = useRouter();
    const props = router.query;
    const mode = props.mode;
    const id = props.id;

    const [judul, setJudul] = useState<string>("");
    const [startY, setStartY] = useState<string>("");
    const [endY, setEndY] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getBKDData = async(id : string | string[] | undefined) => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getBkdById/${id}`, auth);
            const res:TResp1BKD = ax.data;
            const data:TDataBKD = res.data;
            setJudul(data.judul_bkd);
            setStartY(data.start_year.toString());
            setEndY(data.end_year.toString());
            setSemester(data.semester);
            setLoading(false);
        }

        const displayPDF = async (id: string | string[] | undefined) => {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getFileBkdById/${id}`, {
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
            getBKDData(id);
            displayPDF(id);
        }
    }, [id])        

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "judul") {
            setJudul(e.target.value);
        } else if (e.target.name === "startY") {
            if (e.target.value.length <= 4) {
                setStartY(e.target.value);
            } 
        } else if (e.target.name === "endY") {
            if (e.target.value.length <= 4) {
                setEndY(e.target.value);
            }
        } else if (e.target.name === "semester") {
            setSemester(e.target.value);
        }
    }

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push("/bkd");
    }

    const saveHandler = async() => {
        const formData = new FormData();
        formData.append("dosen_nip", nip);
        formData.append("judul_bkd", judul);
        formData.append("start_year", startY);
        formData.append("end_year", endY);
        formData.append("semester", semester);

        if (id !== "-1") { //in EDIT mode
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/updateBkdById/${id}`, formData, auth);
            } catch(err) {
                console.log(err);
            } finally {
                router.back();
            }
        } 
        else { //in ADD mode
            try {
                formData.append("file_bkd", filee as any);
    
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/addBkd`, formData, auth);
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
                    <div className={styles.current_page}>{mode==="edit" ? "Edit" : "Tambah"} BKD</div>
                </div>

                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="semester">Semester</label>
                        {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                            <Select
                                options={[
                                    {value: "Ganjil", label: "Ganjil"},
                                    {value: "Genap", label: "Genap"}
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
                                value={{value: semester, label: semester}}
                                onChange={(opt) => setSemester(opt!.value)}
                            />
                        </div>}
                    </div>

                    <div className={styles.field}>
                        <label>Tahun Ajaran</label>
                        <input className={loading ? styles.loadingInput : ""} type="number" id={styles["startY"]} value={startY} name="startY" onChange={changeHandler} />{" - "}
                        <input className={loading ? styles.loadingInput : ""} type="number" id={styles["endY"]} value={endY} name="endY" onChange={changeHandler} onFocus={() => setEndY((Number(startY)+1).toString())} />
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

export default AddData