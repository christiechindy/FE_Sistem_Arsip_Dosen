export type TDataBKD = {
    id: string;
    dosen_nip: string;
    start_year: number;
    end_year: number;
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