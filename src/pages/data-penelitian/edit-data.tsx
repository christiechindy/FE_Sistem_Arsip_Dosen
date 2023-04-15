"use client";
import Layout from '@/components/Layout';
import Link from 'next/link';
import styles from "../../styles/PageContent.module.css";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TDataPenelitian, TResponse, TRespDosen, TDosenDD } from './Types';
import axios from 'axios';
import Select from "react-select";
import Loading from '@/components/Loading';
import XDel from '../../assets/XDel';
import { auth } from '@/utils/token';

const mhsdummy = [
    {
        value: "D121201077",
        label: "Chindy Christie"
    }, 
    {
        value: "D121201004",
        label: "Fauzan Adithya Z.M."
    },
]

const EditPenelitian = () => {
    const router = useRouter();
    const props = router.query;
    const id = props.id;

    const [loading, setLoading] = useState<boolean>(false);

    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [dosenFields, setDosenFields] = useState([
        {value: "", label: ""}
    ])
    const [mhsFields, setMhsFields] = useState([
        {value: "", label: ""}
    ])

    const [dosenData, setDosenData] = useState<TDosenDD[]>([]);

    // Get dosen data to display for options
    useEffect(() => {
        const getAllDosen = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getAllDosen`, auth);
            const data:TRespDosen = res.data;
            let dosenDD = [];
            for (let i = 0; i < data.count; i++) {
                dosenDD.push({value: data.data[i].nip, label: data.data[i].nama_dosen});
            }
            setDosenData(dosenDD);
        }

        getAllDosen();
    }, [])

    const getDataPenelitian = async () => {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getPenelitianById/${id}`, auth);
        const data:TDataPenelitian = res.data.data;
        setJudul(data.judul_penelitian);
        setTahun(data.tahun_penelitian.toString());
        let dosen = [];
        for (let i = 0; i < data.dosen.length; i++) {
            dosen.push({value: data.dosen[i].nip, label: data.dosen[i].nama_dosen});
        }
        let mhs = [];
        for (let i = 0; i < data.mahasiswa.length; i++) {
            mhs.push({value: data.mahasiswa[i].nim, label: data.mahasiswa[i].nama_mahasiswa});
        }
        setDosenFields(dosen);
        setMhsFields(mhs);
        setLoading(false);
    }

    useEffect(() => {
        getDataPenelitian();
    }, [])
    
    return (
        <Layout>
            {/* {loading ? <Loading /> : ""} */}
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>Edit Data Penelitian</div>
                </div>

                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="judul">Judul Penelitian</label>
                        <input type="text" id="judul" value={judul}/>
                    </div>
                    
                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun</label>
                        <input type="number" id="tahun" value={tahun} onChange={(e) => setTahun(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>Dosen Peneliti</label>
                        {dosenFields.map((input, idx) => (
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
                                    // onChange={opt => handleDosenChange(opt!.value, opt!.label, idx)}
                                />
                                <div className={styles.delPerson} onClick={() => delDosenField(input.value)}><XDel/></div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.add_input} onClick={addDosenField}>Add</button>


                    <div className={styles.field}>
                        <label>Mahasiswa yang Terlibat</label>
                        {mhsFields.map((input, idx) => (
                            <div className={styles.inputtanPerOrg}>
                                <Select 
                                    options={mhsdummy}
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
                                />
                                <div className={styles.delPerson} onClick={() => delMhsField(input.value)}><XDel /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default EditPenelitian