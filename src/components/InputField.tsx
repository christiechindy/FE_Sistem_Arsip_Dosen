import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styles from "../styles/PageContent.module.css";
import Select from "react-select";
import XDel from "@/assets/XDel";

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

export const InputDataList = ({loading, label, value, setValue}: IPropsInputText) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""}  type="text" list="sarjana" value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setValue("")}/>
            <datalist id="sarjana">
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
            </datalist>
        </div>
    );
}

interface IPropsInputNumber {
    loading: boolean,
    label: string,
    value: number,
    setValue: Dispatch<SetStateAction<number | undefined>>
}

export const InputNumberField = ({loading, label, value, setValue}: IPropsInputNumber) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="text" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))} />
        </div>
    )
}

interface IPropsUneditableTF {
    loading: boolean,
    label: string,
    value: string,
}
export const UneditableTextField = ({loading, label, value}: IPropsUneditableTF) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="text" value={value} style={{
                cursor: "not-allowed",
                textTransform: "capitalize"
            }} disabled />
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

export const InputMonthYearField = ({loading, label, value, setValue}: IPropsInputText) => {
    return (
        <div className={styles.field}>
            <label htmlFor="month_year">{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="month" id="month_year" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => {setValue(e.target.value)}} />
        </div>
    )
}

interface IPropsInputDateRange {
    loading: boolean,
    label: string,
    start: string,
    setStart: Dispatch<SetStateAction<string>>,
    end: string,
    setEnd: Dispatch<SetStateAction<string>>,
}

export const InputYearRangeField = ({loading, label, start, setStart, end, setEnd}: IPropsInputDateRange) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input className={loading ? styles.loadingInput : ""} type="number" id={styles["startY"]} value={start} name="startY" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length <= 4) {
                    setStart(e.target.value)
                }    
            }} />
            {" - "}
            <input className={loading ? styles.loadingInput : ""} type="number" id={styles["endY"]} value={end} name="endY" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length <= 4) {
                    setEnd(e.target.value)
                }
            }} onFocus={() => setEnd((Number(start)+1).toString())} />
        </div>
    );
}

export const InputDateRangeField = ({loading, label, start, setStart, end, setEnd}: IPropsInputDateRange) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input style={{width: "180px"}} className={loading ? styles.loadingInput : ""} type="date" value={start} name="startY" onChange={(e: ChangeEvent<HTMLInputElement>) => {setStart(e.target.value)}} />
            {" - "}
            <input style={{width: "180px"}} className={loading ? styles.loadingInput : ""} type="date" value={end} name="endY" onChange={(e: ChangeEvent<HTMLInputElement>) => {setEnd(e.target.value)}} />
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

interface IPropsInputDDMahasiswa {
    loading: boolean,
    mhsFields: IOption[],
    mhsData: IOption[],
    handleMhsChange(nim: string, nama_mahasiswa: string, idx: number): Promise<void>,
    handleInputChange(inputValue: string): void,
    delMhsField(nim: string): void
}

export const InputDropDownMahasiswa = ({loading, mhsFields, mhsData, handleMhsChange, handleInputChange, delMhsField}: IPropsInputDDMahasiswa) => {
    return (
        <div className={styles.field}>
            <label>Mahasiswa yang Terlibat</label>
            {loading ? <input type="text" className={styles.loadingInput} style={{marginBottom: "7px"}} /> : mhsFields.map((input, idx) => (
                <div className={styles.inputtanPerOrg}>
                    <Select 
                        options={mhsData}
                        value={input}
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
                        onChange={opt => handleMhsChange(opt!.value, opt!.label, idx)}
                        onInputChange={handleInputChange}
                    />
                    <div className={styles.delPerson} onClick={() => delMhsField(input.value)}><XDel /></div>
                </div>
            ))}
        </div>
    );
}

interface IPropsInputDDMahasiswaTunggal {
    loading: boolean,
    mhsData: IOption[],
    handleInputChange(inputValue: string): void,
    nim: string,
    setNim: Dispatch<SetStateAction<string>>,
    setName: Dispatch<SetStateAction<string>>
}

export const InputDropDownMahasiswaTunggal = ({loading, mhsData, handleInputChange, nim, setNim, setName}: IPropsInputDDMahasiswaTunggal) => {
    return (
        <div className={styles.field}>
            <label>Mahasiswa yang Terlibat</label>
            {loading ? 
                <input type="text" className={styles.loadingInput} style={{marginBottom: "7px"}} /> 
                : 
                <div className={styles.inputtanPerOrg}>
                    <Select 
                        options={mhsData}
                        value={{value: nim, label: mhsData.find(d => d.value === nim)?.label}}
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
                        onChange={(opt) => {
                            setNim(opt!.value);
                            setName(opt!.label!);
                        }}
                        onInputChange={handleInputChange}
                    />
                </div>
            }
        </div>
    );
}

interface IPropsInputDDPeneliti {
    loading: boolean,
    label: string,
    dosenFields: IOption[],
    dosenData: IOption[],
    handleDosenChange(nip: string, nama_dosen: string, idx: number): void,
    delDosenField(nip: string): void
}

export const InputDropDownDosen = ({loading, label, dosenFields, dosenData, handleDosenChange, delDosenField}: IPropsInputDDPeneliti) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            {loading ? <input type="text" className={styles.loadingInput} style={{marginBottom: "7px"}} /> : dosenFields.map((input, idx) => (
                <div className={styles.inputtanPerOrg}>
                    <Select 
                        options={dosenData}
                        value={input}
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
                        onChange={opt => handleDosenChange(opt!.value, opt!.label, idx)}
                    />
                    <div className={styles.delPerson} onClick={() => delDosenField(input.value)}><XDel/></div>
                </div>
            ))}
        </div>
    );
}

interface IPropsInputDDTunggal {
    loading: boolean,
    label: string,
    optionsData: IOption[],
    nip: string,
    setNip: Dispatch<SetStateAction<string>>
}

export const InputDropDownTunggal = ({loading, label, optionsData, nip, setNip}: IPropsInputDDTunggal) => {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            {loading ? <input type="text" className={styles.loadingInput} /> : <div className={styles.inputtanPerOrg}>
                <Select
                    options={optionsData}
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
                    value={{value: nip, label: optionsData.find(d => d.value === nip)?.label}}
                    onChange={(opt) => setNip(opt!.value)}
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