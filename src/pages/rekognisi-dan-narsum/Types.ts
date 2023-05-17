export type TDataRekogNarsum = {
    id: string;
    judul_rekognisi_narsum: string;
    tahun_rekognisi_narsum: number;
    jenis_rekognisi_narsum: string;
    file_rekognisi_narsum: string;
    dosen_nip: string;
}

export type TRespRekogNarsum = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataRekogNarsum[];
}

export type TResp1RekogNarsum = {
    status: string;
    code: number;
    message: string;
    data: TDataRekogNarsum;
}