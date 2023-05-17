import styles from "../styles/DeleteModal.module.css";
import WarningIcon from "@/assets/WarningIcon";
import { useState } from 'react';

interface IProps {
    showDelModal: boolean;
    setShowDelModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSure_to_del: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({showDelModal, setShowDelModal, setSure_to_del}: IProps) => {
    const [bgClicked, setBgClicked] = useState<boolean>(false);
    const [boxClicked, setBoxClicked] = useState<boolean>(false);

    const handleBackgroundClick = () => {
        setBgClicked(true);
        setShowDelModal(false);
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
                    <button className={styles.cancel_btn} onClick={handleBackgroundClick}>Cancel</button>
                    <button className={styles.delete_btn} onClick={() => setSure_to_del(true)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Modal