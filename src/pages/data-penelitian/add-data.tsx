import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import XDel from '../../assets/XDel';
import Select from "react-select";
import { useState, MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { TDosenDD } from './Interfaces';

const dosendummy = [
    {
        value: "83647836578364",
        label: "Prof. Professor"
    }, 
    {
        value: "1",
        label: "Kosong Satu"
    },
    {
        value: "107437242897483",
        label: "Dr. Doktor, S.T."
    }
]

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

const TambahPenelitian = () => {
    /* 
        --- Input Dosen ---
    */
    // const [dosenData, setDosenData] = useState<TDosenDD[]>([]);

    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getAllDosen`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         for (let i = 0; i < data.data.length; i++) {
    //             console.log(i);
    //             // console.log(data.data[i].nip, data.data[i].nama_dosen);
    //             setDosenData([...dosenData, {value: data.data[i].nip, label: data.data[i].nama_dosen}])
    //         }
    //     })
    // }, [])

    // function checkDosenDD() {
    //     console.log(dosenData);
    // }

    const [dosenFields, setDosenFields] = useState([
        {value: "", label: ""}
    ])

    const handleDosenChange = (nip: string, nama_dosen: string, idx: number) => {
        let data = [...dosenFields];
        data[idx].value = nip;
        data[idx].label = nama_dosen;
        setDosenFields(data);
    }

    const addDosenField = () => {
        setDosenFields([...dosenFields, {value: "", label: ""}])
    }

    const delDosenField = (nip: string) => {
        setDosenFields(dosenFields.filter(dsn => dsn.value !== nip));
    }
    //----------------------------------------------------

    /* 
        --- Input Mahasiswa ---
    */
    const [mhsFields, setMhsFields] = useState([
        {value: "", label: ""}
    ])

    const handleMhsChange = (nim: string, nama_mahasiswa: string, idx: number) => {
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
    //----------------------------------------------------

    /* 
        --- Judul, Tahun Penelitian ---
    */
    const [judul, setJudul] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [filee, setFilee] = useState<File | null>(null);

    //----------------------------------------------------

    /* 
        --- Save, Cancel Handler ---
    */
    const router = useRouter();

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.back();
    }

    const saveHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("judul_penelitian", judul);
            formData.append("tahun_penelitian", tahun);
            for (let i = 0; i < dosenFields.length; i++) {
                let key = `dosen_nip[${i}]`;
                formData.append(key, dosenFields[i].value);
            }
            for (let i = 0; i < mhsFields.length; i++) {
                let key = `mahasiswa_nim[${i}]`;
                formData.append(key, mhsFields[i].value);
            }
            formData.append("file_penelitian", filee as any);

            console.log(formData);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/addPenelitian`, {
                method: "POST",
                body: formData
            }).then((res) => res.json())
        } catch (err) {
            console.log(err);
        } finally {
            router.back();
        }
    }
    //----------------------------------------------------

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        Tambah Penelitian
                    </div>
                </div>

                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="judul">Judul Penelitian</label>
                        <input type="text" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} />
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
                                    options={dosendummy}
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
                    <button className={styles.add_input} onClick={addMhsField}>Add</button>
                
                    <div className={styles.field}>
                        <label htmlFor="file">File</label>
                        <input type="file" id="file" onChange={e => {
                            if (!e.target.files) return;
                            setFilee(e.target.files[0])
                        }} />
                    </div>

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