"use client";

import Layout from "@/components/Layout"
import styles from "../../styles/PageContent.module.css"
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent } from "react";
import {useState} from 'react';

const AddData = () => {
    const router = useRouter();

    const [nip, setNip] = useState<string>("");
    const [startY, setStartY] = useState<string>("");
    const [endY, setEndY] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [filee, setFile] = useState<File | null>(null);

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push("/bkd");
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "nip") {
            setNip(e.target.value);
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

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("dosen_nip", nip);
            formData.append("start_year", startY);
            formData.append("end_year", endY);
            formData.append("semester", semester);
            formData.append("file_bkd", filee as any);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/addBkd`, {
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
                        <label>Tahun Ajaran</label>
                        <input type="number" id={styles["startY"]} value={startY} name="startY" onChange={changeHandler} />{" - "}
                        <input type="number" id={styles["endY"]} value={endY} name="endY" onChange={changeHandler} onFocus={() => setEndY((Number(startY)+1).toString())} />
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