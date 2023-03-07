import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent } from "react";
import {useState} from 'react';
import { TNewBKD } from "./Interfaces";

const AddData = () => {
    const router = useRouter();

    const [nip, setNip] = useState<string>("");
    const [tahun, setTahun] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [filee, setFile] = useState<File | null>(null);

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push("/bkd");
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "nip") {
            setNip(e.target.value);
        } else if (e.target.name === "tahun") {
            setTahun(e.target.value);
        } else if (e.target.name === "semester") {
            setSemester(e.target.value);
        }
    }

    const submitHandler = () => {
        try {
            const formData = new FormData();
            formData.append("dosen_nip", nip);
            formData.append("tahun_ajaran", tahun);
            formData.append("semester", semester);
            formData.append("file_bkd", filee as any);

            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/addBkd`, {
                method: "POST",
                body: formData
            }).then((res) => res.json())
        } catch (err) {
            console.log(err);
        } finally {
            router.push("/bkd");
        }
    }

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>Tambah BKD</div>
                </div>
                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="nip">NIP Dosen</label>
                        <input type="text" id="nip" value={nip} name="nip" onChange={changeHandler} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun Ajaran</label>
                        <input type="number" id="tahun" value={tahun} name="tahun" onChange={changeHandler} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="semester">Semester</label>
                        <input type="text" id="semester" value={semester} name="semester" onChange={changeHandler} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="file">File</label>
                        <input type="file" id="file" onChange={e => {
                            if (!e.target.files) return;
                            setFile(e.target.files[0])
                        }} />
                    </div>
                    <div className={styles.action_btn}>
                        <button className={styles.cancel} onClick={cancelHandler}>Cancel</button>
                        <button className={styles.save} onClick={submitHandler}>Save</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AddData