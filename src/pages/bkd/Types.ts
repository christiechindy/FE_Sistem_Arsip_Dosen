export type TDataBKD = {
    id: string;
    judul_bkd: string;
    start_year: number;
    end_year: number;
    semester: string;
    file_bkd: string;
    dosen_nip: string;
}

export type TRespBKD = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataBKD[]
}

export type TResp1BKD = {
    status: string;
    code: number;
    message: string;
    data: TDataBKD;
}