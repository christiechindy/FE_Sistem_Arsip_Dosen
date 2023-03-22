export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    dosen: TDosen[];
    mahasiswa: TMhsTerlibat[];
    file_penelitian: string;
}

export type TDosenDD = {
    value: string,
    label: string
}

export type TDosen = {
    nip: string,
    nama_dosen: string
}

export type TMhsTerlibat = {
    nim: string,
    nama_mahasiswa: string
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