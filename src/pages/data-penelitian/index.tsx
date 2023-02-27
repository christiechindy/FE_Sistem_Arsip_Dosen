import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState } from 'react';
import Modal from "@/components/Modal";
import { TResponse, TReturn } from "./Interfaces";

interface IProps {
    data_penelitian: TResponse;
}

const DataPenelitian = ({data_penelitian} : IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <button className={styles.add_btn}>Tambah</button>
                    <div className={styles.tooltip}>Upload file penelitian</div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nama Penelitian</th>
                            <th>Tahun</th>
                            <th>Peneliti</th>
                            <th>Yang terlibat</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data_penelitian.data.map(data => (
                            <tr>
                                <td>{data.judul_penelitian}</td>
                                <td>{data.tahun_penelitian}</td>
                                <td>{data.dosen_peneliti}</td>
                                <td>{data.terlibat}</td>
                                <td><Link href="/KTP.pdf" target="_blank" rel="noopener noreferrer" className={styles.iconlink}>
                                    <FileIcon />
                                </Link></td>
                                <td><Link href="" className={styles.iconlink}>
                                    <PencilIcon />
                                </Link></td>
                                <td><div className={styles.iconlink} onClick={() => setShowModal(true)}>
                                    <DeleteIcon />
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showModal ? <Modal showModal={showModal} setShowModal={setShowModal} /> : ""}
            </div>
        </Layout>
    );
}

export const getServerSideProps = async ():Promise<TReturn> => {
    // Fetch data from external API
    const res = await fetch(`http://localhost:8000/api/penelitian/get-all`)
    const data_penelitian:TResponse = await res.json()
    console.log(data_penelitian)

    // Pass data to the page via props
    return { props: { data_penelitian } }
}

export default DataPenelitian;