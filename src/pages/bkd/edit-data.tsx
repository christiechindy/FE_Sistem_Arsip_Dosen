"use client";

import Layout from '@/components/Layout';
import styles from "../../styles/PageContent.module.css";
import React, {useState} from 'react'
import { ChangeEvent, MouseEvent } from "react";
import { useRouter } from 'next/router';

const EditData = () => {
    const router = useRouter();
    const props = router.query;
    console.log(props);

    const id = props.id;
    const [nip, setNip] = useState<any>(props.dosen_nip);
    const [startY, setStartY] = useState<any>(props.start_year);
    const [endY, setEndY] = useState<any>(props.end_year);
    const [semester, setSemester] = useState<any>(props.semester);
    // const [filee, setFilee] = useState<File | string>(props.file_bkd);

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

    const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push("/bkd");
    }

    const updateHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("dosen_nip", nip);
            formData.append("start_year", startY);
            formData.append("end_year", endY);
            formData.append("semester", semester);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/updateBkdById/${id}`, {
                method: "POST",
                body: formData
            }).then((res) => res.json())
        } catch(err) {
            console.log(err);
        } finally {
            router.back();
        }
    }

    const fileOpenHandler = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bkd/getFileBkdById/${id}`, {
            method: "GET"
        }).then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          })
    }

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>Edit BKD</div>
                </div>
                <div className={styles.contents}>
                    <div className={styles.field}>
                        <label htmlFor="nip">NIP Dosen</label>
                        <input type="text" id="nip" value={nip} name="nip" onChange={changeHandler} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tahun">Tahun Ajaran</label>
                        <input type="number" id={styles["startY"]} value={startY} name="startY" onChange={changeHandler} />{" - "}
                        <input type="number" id={styles["endY"]} value={endY} name="endY" onChange={changeHandler} onFocus={() => setEndY((Number(startY)+1).toString())} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="semester">Semester</label>
                        <input type="text" id="semester" value={semester} name="semester" onChange={changeHandler} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="file">File</label>
                        <input type="text" className={styles.namafile} value={props.file_bkd} onClick={fileOpenHandler} />
                        {/* <input type="file" id="file" onChange={e => {
                            if (!e.target.files) return;
                            setFilee(e.target.files[0])
                        }} /> */}
                    </div>
                    <div className={styles.action_btn}>
                        <button className={styles.cancel} onClick={cancelHandler}>Cancel</button>
                        <button className={styles.save} onClick={updateHandler}>Save</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default EditData