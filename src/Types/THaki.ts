import { TDosen } from "./CommonTypes";

export type TDataHAKI = {
    id: string;
    judul_haki: string;
    tahun_haki: string;
    file_haki: string;
    dosen_nip: string;
    dosen?: TDosen;
}

export type TRespHAKI = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataHAKI[];
}

export type TResp1HAKI = {
    status: string;
    code: number;
    message: string;
    data: TDataHAKI;
}