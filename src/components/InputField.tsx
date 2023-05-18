import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styles from "../styles/PageContent.module.css";
import Select from "react-select";

interface IPropsInputText {
    loading: boolean,
    label: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

export const InputTextField = ({loading, label, value, setValue}: IPropsInputText) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="text" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />
        </div>
    )
}

export const InputYearField = ({loading, label, value, setValue}: IPropsInputText) => {
    return (
        <div className={styles.field}>
            <label htmlFor="tahun">{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="number" id="tahun" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if(e.target.value.length <= 4) {
                    setValue(e.target.value);
                }
            }} />
        </div>
    )
}

interface IPropsInputYearRange {
    loading: boolean,
    label: string,
    start: string,
    setStart: Dispatch<SetStateAction<string>>,
    end: string,
    setEnd: Dispatch<SetStateAction<string>>,
}

export const InputYearRangeField = ({loading, label, start, setStart, end, setEnd}: IPropsInputYearRange) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="number" id={styles["startY"]} value={start} name="startY" onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)} />
            {" - "}
            <input className={loading ? styles.loadingInput : ""} type="number" id={styles["endY"]} value={end} name="endY" onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)} onFocus={() => setEnd((Number(start)+1).toString())} />
        </div>
    );
}

interface IOption {
    value: string,
    label: string
}

interface IPropsInputDD {
    loading: boolean,
    label: string,
    options: IOption[],
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

export const InputDropDownField = ({loading, label, options, value, setValue}: IPropsInputDD) => {
    return (
        <div className={styles.field}>
            <label htmlFor="jenis">{label}</label>
            {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                <Select
                    options={options}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            border: state.isFocused ? "1.5px solid #0085FF" : "1.5px solid #dadada",
                            borderRadius: "10px",
                            outline: state.isFocused ? "none" : "",
                            fontSize: "14px",
                            paddingLeft: "8px",
                            fontWeight: "400",
                        }),
                    }}
                    value={{value: value, label: value}}
                    onChange={(opt) => setValue(opt!.value)}
                />
            </div>}
        </div>
    );
}

interface IPropsInputFile {
    label: string,
    setValue: Dispatch<SetStateAction<File | null>>
}

export const InputFileField = ({label, setValue}: IPropsInputFile) => {
    return (
        <div className={styles.field}>
            <label htmlFor="file">{label}</label>
            <input type="file" id="file" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (!e.target.files) return;
                setValue(e.target.files[0])
            }} />
        </div>
    );
}