export type TReturn = {
    props: { data_penelitian: TResponse }
}

export type TResponse = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPenelitian[]
}

export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    dosen_peneliti: string;
    terlibat: string;
    file_penelitian: string;
    created_at: string;
    updated_at: string
}