export type TDataSertif = {
    id: string;
    judul_sertifikat_dosen: string;
    tahun_sertifikat_dosen: number;
    file_sertifikat_dosen: string;
    dosen_nip: string;
}

export type TResponse = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataSertif[]
}