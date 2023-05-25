export type TBiodata = {
    id: string;
    nip: string;
    nama: string;
    email?: string;
    pangkat?: string;
}

export type TRespBiodata = {
    status: string;
    message: string;
    data: TBiodata;
}