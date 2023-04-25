export type TTokenData = {
    access_token: string;
    message: string;
    token_type: string;
}

export type TUserData = {
    id: number;
    nip: string;
    role: number;
    nama: string;
    administrator: number;
    jabatan: number | null;
    prodi_kode: null | string | number;
    prodi: null | string;
    nik: null | string;
    remember_token: null | string;
    created_at: null | string;
    updated_at: null | string;
}