// params format : 2222-12
export const changeDateFormat = (date: string) => {
    const datee = date.split("-");
    const y = parseInt(datee[0]);
    const m = parseInt(datee[1]);

    let month = "";

    switch(m) {
        case 1:
            month = "Jan"
            break;
        case 2: 
            month = "Feb"
            break;
        case 3:
            month = "Mar"
            break;
        case 4:
            month = "Apr"
            break;
        case 5: 
            month = "Mei"
            break;
        case 6:
            month = "Jun"
            break;
        case 7:
            month = "Jul"
            break;
        case 8:
            month = "Agt"
            break;
        case 9:
            month = "Sep"
            break;
        case 10:
            month = "Okt"
            break;
        case 11:
            month = "Nov"
            break;
        case 12:
            month = "Des"
            break;
    }

    return (month + " " + y)
}