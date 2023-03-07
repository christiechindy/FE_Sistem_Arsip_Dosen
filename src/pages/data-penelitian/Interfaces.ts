export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    dosen_peneliti: string;
    terlibat: string;
    file_penelitian: string;
}

export type TResponse = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPenelitian[]
}

export type TReturn = {
    props: { data_penelitian: TResponse }
}