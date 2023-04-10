export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    file_penelitian: string;
    dosen: TDosen[];
    mahasiswa: TMhsTerlibat[];
}

export type TDosenDD = {
    value: string;
    label: string
}

export type TRespDosen = {
    count: number;
    data: TDosen[];
    message: string;
    status: string;
}

export type TDosen = {
    id: string;
    nip: string;
    nama_dosen: string;
    email_dosen: string | null;
    pangkat_dosen: string | null;
}

export type TMhsTerlibat = {
    id: string;
    nim: string;
    nama_mahasiswa: string;
    email_mahasiswa: string | null;
    fakultas: string | null;
    prodi: string | null;
}

export type TResponse = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPenelitian[]
}