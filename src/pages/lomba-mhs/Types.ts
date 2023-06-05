export type TMhs = {
    id: string;
    nim: string;
    email: string;
    first_name: string;
    last_name: string;
}

export type TDokumentasi = {
    id: string;
    lomba_id: string;
    file_dokumentasi_lomba: string;
}

export type TDataLomba = {
    id: string;
    nama_lomba: string;
    start_date: string;
    end_date: string;
    penyelenggara: string;
    file_lomba: any;
    mahasiswa?: TMhs[];
    dokumentasi: TDokumentasi[];
}

export type TRespDataLomba = {
    status: string;
    code: number;
    message: string;
    count: number;
    data: TDataLomba[];
}

export type TResp1DataLomba = {
    status: string;
    code: number;
    message: string;
    data: TDataLomba;
}

export type TEditableAttributes = {
    nama_lomba: string;
    penyelenggara: string;
    start_date: string;
    end_date: string;
}