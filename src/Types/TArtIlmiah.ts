import { TDosen } from "./CommonTypes";

export type TDataArtIlmiah = {
    id: string;
    judul_artikel_ilmiah: string;
    vnt: string;
    nama_jurnal: string;
    file_artikel_ilmiah: string;
    dosen_nip: string;
    dosen: TDosen;
}

export type TRespArtIlmiah = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataArtIlmiah[];
}

export type TResp1ArtIlmiah = {
    status: string;
    code: number;
    message: string;
    data: TDataArtIlmiah;
}