export type TDataHAKI = {
    judul_haki: string;
    tahun_haki: string;
    dosen_nip: string;
    file_haki: string;
    id: string;
}

export type TRespHAKI = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataHAKI[];
}

export type TData1HAKI = {
    id: string;
    judul_haki: string;
    tahun_haki: number;
    file_haki: string;
    dosen_nip: string;
    dosen: {
        nip: string;
        nama_dosen: string;
    }
}

export type TResp1HAKI = {
    status: string;
    code: number;
    message: string;
    data: TData1HAKI;
}