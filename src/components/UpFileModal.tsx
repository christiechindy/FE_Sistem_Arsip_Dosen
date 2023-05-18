import React, {ChangeEvent, useState} from "react";
import styles from "../styles/UpFileModal.module.css";
import Link from "next/link";
import { useContext } from "react";
import { FileContext } from "@/context/FileContext";

interface IProps {
    showUpFileModal: boolean;
    setShowUpFileModal: React.Dispatch<React.SetStateAction<boolean>>
}

const UpFileModal = ({showUpFileModal, setShowUpFileModal}: IProps) => {
    const [bgClicked, setBgClicked] = useState<boolean>(false);
    const [boxClicked, setBoxClicked] = useState<boolean>(false);

    const handleBackgroundClick = () => {
        setBgClicked(true);
        setShowUpFileModal(false);
    }

    const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
        setBoxClicked(true);
    }

    const {setFileToScan} = useContext(FileContext);

    return (
        <div className={styles.bg} onClick={handleBackgroundClick}>
            <div className={styles.modal_box} onClick={handleBoxClick}>
                <div className={styles.content}>
                    <label htmlFor="file_penelitian">Upload File</label>
                    <input type="file" id="file_penelitian" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (!e.target.files) return;
                        setFileToScan(e.target.files[0])
                    }} />
                    <Link className={styles.scanBtn} href={{
                        pathname: "/data-penelitian/write-data",
                        query: {
                            mode: "add",
                            id: "-1"
                        }
                    }}>Scan</Link>
                </div>
            </div>
        </div>
    )
}

export default UpFileModal