import React, {useState} from "react";
import styles from "../styles/UpFileModal.module.css";

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

    return (
        <div className={styles.bg} onClick={handleBackgroundClick}>
            <div className={styles.modal_box} onClick={handleBoxClick}>
                <div className={styles.content}>
                    <label htmlFor="file_penelitian">Upload File</label>
                    <input type="file" id="file_penelitian" />
                </div>
            </div>
        </div>
    )
}

export default UpFileModal