import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState } from 'react';
import Modal from "@/components/DeleteModal";
import { TResponse, TReturn } from "./Interfaces";
import UpFileModal from "@/components/UpFileModal";

// interface IProps {
//     data_penelitian: TResponse;
// }

const data_penelitian:TResponse = {
    status: "SUCCESS",
    code: 200,
    message: "-",
    count: 3,
    data: [
        {
            id: "987djkhjfkhdk",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen_peneliti: "Prof. Bayu",
            terlibat: "Fauzan",
            file_penelitian: "/KTP.pdf"
        },
        {
            id: "dksgfdjgfhdg834",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen_peneliti: "Prof. Bayu",
            terlibat: "Fauzan",
            file_penelitian: "/KTP.pdf"
        },
        {
            id: "lsifdi7830492",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen_peneliti: "Prof. Bayu, hhhhhhhhh",
            terlibat: "Fauzan",
            file_penelitian: "/KTP.pdf"
        },
        {
            id: "djkshdf83694326d",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen_peneliti: "Prof. Bayu",
            terlibat: "Fauzan",
            file_penelitian: "/KTP.pdf"
        },
        {
            id: "93728jfkdgfhg73hr8f",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen_peneliti: "Prof. Bayu",
            terlibat: "Fauzan",
            file_penelitian: "/KTP.pdf"
        },
    ]
} 

const DataPenelitian = () => {
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [showUpFileModal, setShowUpFileModal] = useState<boolean>(false);

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <button className={styles.add_btn} onClick={() => setShowUpFileModal(true)}>Tambah</button>
                    <div className={styles.tooltip}>Upload file penelitian</div>
                </div>
                {showUpFileModal ? <UpFileModal showUpFileModal={showUpFileModal} setShowUpFileModal={setShowUpFileModal} /> : ""}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Penelitian</th>
                            <th>Tahun</th>
                            <th>Peneliti</th>
                            <th>Terlibat</th>
                            <th>File</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data_penelitian?.data.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
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
                                <td><div className={styles.iconlink} onClick={() => setShowDelModal(true)}>
                                    <DeleteIcon />
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDelModal ? <Modal showDelModal={showDelModal} setShowDelModal={setShowDelModal} /> : ""}
            </div>
        </Layout>
    );
}

// export const getServerSideProps = async ():Promise<TReturn> => {
//     // Fetch data from external API
//     const res = await fetch(`http://localhost:8000/api/v1/penelitian/get-all-penelitian`)
//     const data_penelitian:TResponse = await res.json()
//     console.log(data_penelitian)

//     // Pass data to the page via props
//     return { props: { data_penelitian } }
// }

export default DataPenelitian