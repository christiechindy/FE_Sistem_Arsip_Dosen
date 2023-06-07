export type TDataTambahan = {
    id: string;
    judul: string;
    tahun: number;
    nomor_sk: string;
    file: string;
}

export type TRespDataTambahan = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataTambahan[]
}

export type TResp1DataTambahan = {
    status: string;
    code: number;
    message: string;
    data: TDataTambahan;
}