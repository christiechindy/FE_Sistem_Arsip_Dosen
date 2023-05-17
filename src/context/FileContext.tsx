import { createContext, useState } from "react";

export const FileContext = createContext<any>(null);

interface IProps {
    children: any
}

export const FileContextProvider = ({children}: IProps) => {
    const [fileToScan, setFileToScan] = useState<File | null>(null);

    return(
        <FileContext.Provider value={{fileToScan, setFileToScan}}>
            {children}
        </FileContext.Provider>
    );
}