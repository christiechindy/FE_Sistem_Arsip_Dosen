import { TDosen, TDosenPy, TMhsPy, TMhsTerlibat } from "./CommonTypes";

export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    file_penelitian: string;
    dosen: TDosen[];
    mahasiswa: TMhsTerlibat[];
}

export type TRespPenelitian = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPenelitian[]
}

export type TResp1Penelitian = {
    status: string;
    code: number;
    message: string;
    data: TDataPenelitian;
}

export type TDataOCRScan = {
    judul: string;
    tahun: string;
    ketua: TDosenPy;
    dosen: TDosenPy[];
    mahasiswa: TMhsPy[];
}