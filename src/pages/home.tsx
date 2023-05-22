import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Sidebar } from '@/components/Sidebar'
import styles from "../styles/PageContent.module.css"
import Layout from '@/components/Layout'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '@/context/UserContext'
import { InputDropDownTunggal } from '@/components/InputField'
import { TDropDown, TRespDosen } from './CommonTypes'
import axios from 'axios'
import { auth } from '@/utils/token'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const {role} = useContext(UserContext);

    const [loading, setLoading] = useState<boolean>(false);
    /* getALlDosen -> admin pilih dosen yang mau diinputkan datanya */
    const [dosenData, setDosenData] = useState<TDropDown[]>([]);
    const [chosenNip, setChosenNip] = useState<string>("");
    useEffect(() => {
        const getAllDosen = async () => {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dosen/getAllDosen`, auth);
            const data:TRespDosen = res?.data;
            let dosenDD = [];
            for (let i = 0; i < data.count; i++) {
                dosenDD.push({value: data.data[i].nip, label: data.data[i].nama});
            }
            setDosenData(dosenDD);
            setLoading(false);
        }

        if (role === 1) {
            getAllDosen();
        }
    }, [role])

    return (
        <>
            <Head>
                <title>Beranda</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Layout>
                    <div className={styles.page}>
                        <div className={styles.top}>
                            <div className={styles.current_page}>Generate CV</div>
                        </div>
                        <div className={styles.cvBox}>
                            <img src="/cv_illustration.png" alt="generate cv" /> 
                            <div>
                                {role===1 ? 
                                    <InputDropDownTunggal 
                                        loading={loading}
                                        label="Dosen"
                                        optionsData={dosenData}
                                        nip={chosenNip}
                                        setNip={setChosenNip} /> 
                                    : ""
                                }
                                <button>Generate CV</button>
                            </div>
                        </div>
                    </div>
                </Layout>
            </main>
        </>
    )
}
