export type TDataBKD = {
    id: string;
    dosen_nip: string;
    tahun_ajaran: number;
    semester: number | string;
    file_bkd: string;
}

export type TResponse = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataBKD[]
}

export type TNewBKD = {
    dosen_nip: string;
    tahun_ajaran: string;
    semester: string;
    file_bkd: string;
}