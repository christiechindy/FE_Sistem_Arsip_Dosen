import { TDosen, TDosenPy, TMhsPy, TMhsTerlibat } from "../CommonTypes";

export type TDataPengabdian = {
    id: string;
    judul_pengabdian: string;
    tahun_pengabdian: number;
    file_pengabdian: string;
    dosen: TDosen[];
    mahasiswa: TMhsTerlibat[];
}

export type TRespPengabdian = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPengabdian[]
}

export type TResp1Pengabdian = {
    status: string;
    code: number;
    message: string;
    data: TDataPengabdian;
}

export type TDataOCRScan = {
    judul: string;
    tahun: string;
    ketua: TDosenPy;
    dosen: TDosenPy[];
    mahasiswa: TMhsPy[];
}