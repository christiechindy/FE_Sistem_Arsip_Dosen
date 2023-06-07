import { TDosen } from "./CommonTypes";

export type TDataBKD = {
    id: string;
    start_year: number;
    end_year: number;
    semester: string;
    file_bkd: string;
    dosen_nip: string;
    dosen?: TDosen;
}

export type TRespBKD = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataBKD[];
}

export type TResp1BKD = {
    status: string;
    code: number;
    message: string;
    data: TDataBKD;
}