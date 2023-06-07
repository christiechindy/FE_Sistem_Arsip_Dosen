export type TDataLulusan = {
    id: string;
    jumlah: number;
    periode: string;
}

export type TRespDataLulusan = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataLulusan[]
}

export type TResp1DataLulusan = {
    status: string;
    code: number;
    message: string;
    data: TDataLulusan;
}