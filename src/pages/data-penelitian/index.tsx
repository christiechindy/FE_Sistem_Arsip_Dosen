import FileIcon from "@/assets/FileIcon";
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "../../styles/PageContent.module.css";
import PencilIcon from '../../assets/PencilIcon';
import DeleteIcon from "@/assets/DeleteIcon";
import React, { useState, useEffect } from 'react';
import Modal from "@/components/DeleteModal";
import { TResponse, TReturn, TDataPenelitian } from './Interfaces';
import UpFileModal from "@/components/UpFileModal";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

// interface IProps {
//     data_penelitian: TResponse;
// }

const dataPenelitian_dummy:TResponse = {
    status: "SUCCESS",
    code: 200,
    message: "-",
    count: 2,
    data: [
        {
            id: "987djkhjfkhdk",
            judul_penelitian: "Judul 1",
            tahun_penelitian: 2020,
            dosen: [
                {
                    nip: "83647836578364",
                    nama_dosen: "Prof. Indrabayu Amirullah"
                },
                {
                    nip: "1",
                    nama_dosen: "Kosong Satu"
                }
            ],
            mahasiswa: [
                {
                    nim: "D121201077",
                    nama_mahasiswa: "Chindy"
                },
                {
                    nim: "D121201068",
                    nama_mahasiswa: "Mahasiswa"
                }
            ],
            file_penelitian: "/KTP.pdf"
        },
        {
            id: "khkhsdjkfhdsjk",
            judul_penelitian: "Judul 2",
            tahun_penelitian: 2020,
            dosen: [
                {
                    nip: "8326478628362",
                    nama_dosen: "Prof. Ansar Suyuti"
                },
                {
                    nip: "1",
                    nama_dosen: "Kosong Satu"
                }
            ],
            mahasiswa: [
                {
                    nim: "D121201004",
                    nama_mahasiswa: "Adit"
                }
            ],
            file_penelitian: "/KTP.pdf"
        },
    ]
} 

const DataPenelitian = () => {
    const [showDelModal, setShowDelModal] = useState<boolean>(false);
    const [showUpFileModal, setShowUpFileModal] = useState<boolean>(false);

    const [dataPenelitian, setDataPenelitian] = useState<TDataPenelitian[]>(dataPenelitian_dummy.data);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const [count, setCount] = useState<number>(2);

    /* Get ALl Data Penelitian -> run at first render */
    // useEffect(() => {
    //     setLoading(true);
    //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getAllPenelitian`)
    //         .then((res) => res.json())
    //         .then((data:TResponse) => {
    //             setCount(data.count);
    //             setDataPenelitian(data.data);
    //             console.log(data);
    //             setLoading(false);
    //         })
    //         .catch(err => console.error("Error: ", err));
    // }, [])

    /* DELETE A DATA-PENELITIAN */
    const [id_to_del, setId_to_del] = useState<string>("");
    const [sure_to_del, setSure_to_del] = useState<boolean>(false);

    const deleteHandler = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/deletePenelitianById/${id}`, {
            method: "DELETE"
        }).then(() => setDataPenelitian(dataPenelitian.filter(d => d.id !== id)))
        count!==undefined ? setCount(count-1) : "";
        console.log("count", count);
    }

    useEffect(() => {
        if (sure_to_del) {
            deleteHandler(id_to_del);
            setShowDelModal(false);
        }
    }, [sure_to_del])

    useEffect(() => {
        if (!showDelModal) {
            setId_to_del("");
            setSure_to_del(false);
        }
    }, [showDelModal])
    /*------------------------------------------*/

    /* OPEN FILE */
    const fileOpenHandler = async (id: string) => {
        console.log("fileOpenHandler clickesd");
        console.log(id);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/penelitian/getFilePenelitianById/${id}`, {
            method: "GET"
        }).then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          })
    }
    /*------------------------------------------*/

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>List Data Penelitian</div>
                    <Link href="/data-penelitian/add-data" className="add_btn">Tambah</Link>
                    <div className="tooltip">Upload file penelitian</div>
                </div>
                {loading ? <div className={styles.loadingContainer}><Loading /></div> : "" }
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
                        {(count<1) ? <tr><td className={styles.noData} colSpan={8}>No data</td></tr> : ""}
                        {dataPenelitian?.map((data, idx) => (
                            <tr>
                                <td>{idx+1}</td>
                                <td>{data.judul_penelitian}</td>
                                <td>{data.tahun_penelitian}</td>
                                <td>{data.dosen.map(dsn => (dsn.nama_dosen + (data.dosen[data.dosen.length-1].nip!==dsn.nip ? ", " : "")) )}</td>
                                <td>{data.mahasiswa.map(mhs => (mhs.nama_mahasiswa + (data.mahasiswa[data.mahasiswa.length-1].nim!==mhs.nim ? ", " : "")))}</td>
                                <td><div className={styles.iconlink} onClick={() => fileOpenHandler(data.id)}>
                                    <FileIcon />
                                </div></td>
                                <td><Link href={{
                                    pathname: "/data-penelitian/edit-data",
                                    query: {
                                        id: data.id,
                                        judul_penelitian: data.judul_penelitian,
                                        tahun_penelitian: data.tahun_penelitian,
                                        // dosen_peneliti: data.dosen_peneliti,
                                        // terlibat: data.terlibat,
                                        file_penelitian: data.file_penelitian,
                                    }
                                }} className={styles.iconlink}>
                                    <PencilIcon />
                                </Link></td>
                                <td><div className={styles.iconlink} onClick={() => {
                                    setShowDelModal(true);
                                    setId_to_del(data.id);
                                }}>
                                    <DeleteIcon />
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDelModal ? <Modal showDelModal={showDelModal} setShowDelModal={setShowDelModal} setSure_to_del={setSure_to_del} /> : ""}
            </div>
        </Layout>
    );
}

export default DataPenelitian