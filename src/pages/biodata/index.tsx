import Layout from "@/components/Layout";
import styles from "../../styles/PageContent.module.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { InputTextField, UneditableTextField } from "@/components/InputField";
import axios from "axios";
import { TRespBiodata } from "./Types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { TError } from "../CommonTypes";

const Biodata = () => {
    const {nip, accessToken} = useContext(UserContext);
    const auth = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [nama, setNama] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pangkat, setPangkat] = useState<string>("");

    useEffect(() => {
        const getBiodata = async () => {
            setLoading(true);
            const ax = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getDosenByNIP/${nip}`, auth);
            const res:TRespBiodata = ax.data;
            const data = res.data;
            setNama(data?.nama);
            setEmail(data?.email || "");
            setPangkat(data?.pangkat || "");
            setLoading(false);
        }

        getBiodata();
    }, [])

    const router = useRouter();

    const saveHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("pangkat", pangkat || "-");
    
            toast("Please wait");
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/updateDosenByNIP/${nip}`, formData, auth);
            router.back();
        } catch (err) {
            const error = err as TError;
            if (error.response.data.status !== "OK") {
                toast.error(error.response.data.status +" "+ JSON.stringify(error.response.data.message))
            }
        }
    }

    return (
        <Layout>
            <div className={styles.page}>
                <div className={styles.top}>
                    <div className={styles.current_page}>
                        Biodata
                    </div>
                </div>
                <div className={styles.contents}>
                    <UneditableTextField loading={loading} label="
                    NIP" value={nip} />

                    <UneditableTextField loading={loading} label="Nama" value={nama} />

                    <InputTextField loading={loading} label="Email" value={email} setValue={setEmail} />

                    <InputTextField loading={loading} label="Pangkat" value={pangkat} setValue={setPangkat} />

                    <div className={styles.action_btn}>
                        <button className={styles.save} onClick={saveHandler}>Save</button>
                    </div>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        </Layout>
    );
}

export default Biodata;