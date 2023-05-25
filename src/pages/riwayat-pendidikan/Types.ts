export type TDataRipen = {
    id: string;
    sarjana: string;
    kampus: string;
    lokasi: string;
    fakultas?: string;
    prodi?: string;
    tahun_lulus: number;
    file_ijazah: string;
    dosen_nip: string;
}

export type TRespDataRipen = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataRipen[];
}

export type TResp1DataRipen = {
    status: string;
    code: number;
    message: string;
    data: TDataRipen;
}

export type TFieldRipen = {
    sarjana: string;
    kampus: string;
    lokasi: string;
    fakultas: string;
    prodi: string;
    tahun_lulus: string;
    file_ijazah: string;
}