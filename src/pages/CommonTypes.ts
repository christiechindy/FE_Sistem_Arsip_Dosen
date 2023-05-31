import { AxiosHeaders } from "axios";

export type TDropDown = {
    value: string;
    label: string
}

export type TRespDosen = {
    count: number;
    data: TDosen[];
    message: string;
    status: string;
}

export type TRespMhs = {
    status: string;
    message: string;
    count: number;
    data: TMhsTerlibat[];
}

export type TDosen = {
    id: string;
    nip: string;
    nama: string;
    email: string | null;
    pangkat: string | null;
    status: string;
}

export type TMhsTerlibat = {
    id: string;
    nim: string;
    first_name: string;
    last_name: string;
    email: string;
}

export type TDosenPy = {
    nama_dosen: string;
    nip: string;
}

export type TMhsPy = {
    nama_mahasiswa: string;
    nim: string;
}

export type TError = {
    code: string;
    config: any;
    message: string;
    name: string;
    request: XMLHttpRequest;
    response: {
        config: any;
        data: {
            status: string;
            code: number;
            message: any;
        };
        headers: AxiosHeaders;
        request: XMLHttpRequest;
        status: number;
        statusText: string;
    }
}