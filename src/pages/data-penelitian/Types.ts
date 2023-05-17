export type TDataPenelitian = {
    id: string;
    judul_penelitian: string;
    tahun_penelitian: number;
    file_penelitian: string;
    ketua: TDosen;
    dosen: TDosen[];
    mahasiswa: TMhsTerlibat[];
}

export type TDropDown = {
    value: string;
    label: string
}

export type TRespDosen = {
    count: number;
    data: TDosen[];
    message: string;
    status: string;
}

export type TRespMhs = {
    status: string;
    message: string;
    count: number;
    data: TMhsTerlibat[];
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

export type TRespPenelitian = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataPenelitian[]
}

export type TResp1Penelitian = {
    status: string;
    code: number;
    message: string;
    data: TDataPenelitian;
}

export type TDosenPy = {
    nama_dosen: string;
    nip: string;
}

export type TMhsPy = {
    nama_mahasiswa: string;
    nim: string;
}

export type TDataOCRScan = {
    judul_penelitian: string;
    tahun_penelitian: string;
    ketua_penelitian: TDosenPy;
    dosen: TDosenPy[];
    mahasiswa: TMhsPy[];
}