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