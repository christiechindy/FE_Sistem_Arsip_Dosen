import styles from "../styles/DeleteModal.module.css";
import App from '../pages/_app';
import WarningIcon from "@/assets/WarningIcon";
import React, { useState, useEffect } from 'react';

interface IProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({showModal, setShowModal}: IProps) => {
    const [bgClicked, setBgClicked] = useState<boolean>(false);
    const [boxClicked, setBoxClicked] = useState<boolean>(false);

    const handleBackgroundClick = () => {
        setBgClicked(true);
        setShowModal(false);
    }

    const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
        setBoxClicked(true);
    }

    return (
        <div className={styles.bg} onClick={handleBackgroundClick}>
            <div className={styles.modal_box} onClick={handleBoxClick}>
                <div className={styles.content}>
                    <div className={styles.warning_icon}>
                        <WarningIcon />
                    </div>
                    <div className={styles.question}>
                        Apakah Anda yakin ingin menghapus data ini?
                    </div>
                    <div className={styles.desc}>
                        Data yang telah dihapus tidak dapat dikembalikan
                    </div>
                </div>
                <div className={styles.action_btn}>
                    <button onClick={handleBackgroundClick}>Cancel</button>
                    <button>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Modal