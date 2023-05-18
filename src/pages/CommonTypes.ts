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
    nama: string;
    email: string | null;
    pangkat: string | null;
    status: string;
}

export type TMhsTerlibat = {
    id: string;
    nim: string;
    nama: string;
}

export type TDosenPy = {
    nama_dosen: string;
    nip: string;
}

export type TMhsPy = {
    nama_mahasiswa: string;
    nim: string;
}