import { TDosen } from "./CommonTypes";

export type TDataSertif = {
    id: string;
    judul_sertifikat: string;
    tahun_sertifikat: number;
    file_sertifikat: string;
    jenis_sertifikat: string;
    dosen_nip: string;
    dosen?: TDosen;
}

export type TRespSertif = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataSertif[]
}

export type TResp1Sertif = {
    status: string;
    code: number;
    message: string;
    data: TDataSertif;
}