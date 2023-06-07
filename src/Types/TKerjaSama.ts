export type TDataKerjaSama = {
    id: string;
    mitra: string;
    tanggal: string;
    file: string;
}

export type TRespKerjaSama = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataKerjaSama[];
}

export type TResp1KerjaSama = {
    status: string;
    code: number;
    message: string;
    data: TDataKerjaSama;
}