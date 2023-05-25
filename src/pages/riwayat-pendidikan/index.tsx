import { useContext, useEffect, useState } from "react";
import styles from "../../styles/Biodata.module.css";
import Layout from "@/components/Layout";
import { TDataRipen, TFieldRipen, TRespDataRipen } from "./Types";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import Loading from "@/components/Loading";
import XDel from "@/assets/XDel";

const RiwayatPendidikan = () => {
    const {accessToken} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [dataRipen, setDataRipen] = useState([
        {
            sarjana: "",
            kampus: "",
            lokasi: "",
            fakultas: "",
            prodi: "",
            tahun_lulus: "",
            file_ijazah: "",
        }
    ]);

    useEffect(() => {
        const getDataRipen = async () => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/riwayat_pendidikan/getAllRiwayatPendidikan`, auth);
            const res:TRespDataRipen = ax.data;
            const data = res?.data;

            let dataRiwayatPendidikan = [];
            for (let i = 0; i < data.length; i++) {
                dataRiwayatPendidikan.push({
                    sarjana: data[i]?.sarjana,
                    kampus: data[i]?.kampus,
                    lokasi: data[i]?.lokasi,
                    fakultas: data[i]?.fakultas || "",
                    prodi: data[i]?.prodi || "",
                    tahun_lulus: data[i]?.tahun_lulus.toString(),
                    file_ijazah: data[i]?.file_ijazah,
                })
            }
            setDataRipen(dataRiwayatPendidikan);

            setLoading(false);
        }

        getDataRipen();
    }, []);

    // add data ripen
    const addRipenField = () => {
        setDataRipen([...dataRipen, {
            sarjana: "",
            kampus: "",
            lokasi: "",
            fakultas: "",
            prodi: "",
            tahun_lulus: "",
            file_ijazah: "",
        }])
    }

    // delete data ripen
    const delRipenField = (idx: number) => {
        setDataRipen(dataRipen.slice(0, idx).concat(dataRipen.slice(idx+1, dataRipen.length)))
    }

    // update data ripen
    const editRipenField = (nextRipen: TFieldRipen, idx: number) => {
        setDataRipen(
            dataRipen.slice(0, idx).concat(nextRipen).concat(dataRipen.slice(idx+1, dataRipen.length))
        )
    }

    // save data ripen
    

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        Riwayat Pendidikan
                    </div>
                    <button className={styles.saveBtn}>Save</button>
                </div>

                <div className={styles.contents}>
                    {loading ? <div className={styles.loadingContainer}><Loading /></div> : "" }

                    {dataRipen?.map((data, idx) => (
                        <div className={styles.box_riwayat}>
                            <div className={styles.delBox} onClick={() => delRipenField(idx)}>
                                <div className={styles.circle}>
                                    <XDel/>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Sarjana</label>
                                <select value={data.sarjana} onChange={(e) => editRipenField({
                                    ...data,
                                    sarjana: e.target.value
                                }, idx)}>
                                    <option value="S1">S1</option>
                                    <option value="S2">S2</option>
                                    <option value="S3">S3</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="kampus">Nama Kampus</label>
                                <input type="text" id="kampus" required value={data.kampus} onChange={(e) => editRipenField({
                                    ...data,
                                    kampus: e.target.value
                                }, idx)}/>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="lokasi_kampus">Lokasi Kampus</label>
                                <input type="text" id="lokasi_kampus" required value={data.lokasi} onChange={(e) => editRipenField({
                                    ...data,
                                    lokasi: e.target.value
                                }, idx)}/>
                            </div>

                            <div className={styles.field}>
                                <div className={styles.field}>
                                    <label htmlFor="fakultas">Fakultas</label>
                                    <input type="text" id="fakultas" value={data.fakultas} onChange={(e) => editRipenField({
                                    ...data,
                                    fakultas: e.target.value
                                }, idx)} />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="prodi">Program Studi</label>
                                    <input type="text" id="prodi" value={data.prodi} onChange={(e) => editRipenField({
                                    ...data,
                                    prodi: e.target.value
                                }, idx)}/>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="tahun">Tahun Kelulusan</label>
                                <input type="number" id="tahun" value={data.tahun_lulus} onChange={(e) => editRipenField({
                                    ...data,
                                    tahun_lulus: e.target.value
                                }, idx)}/>
                            </div>
                        </div>
                    ))}
                    {loading ? "" : <button onClick={addRipenField} className={styles.add_input}>Add</button>}
                </div>
            </div>
        </Layout>
    );
}

export default RiwayatPendidikan;