export const getTitleByGamesCategory = (data: any) => {
    let labelGameData, titleCardHeader;

    switch (data.categoryId) {
        case process.env.NEXT_PUBLIC_CATEGORY_ID_PULSA_LISTRIK:
            labelGameData = "Nomor Handphone";
            titleCardHeader = `Pilih Nominal`;
            break;
        case process.env.NEXT_PUBLIC_CATEGORY_ID_EWALLET:
            labelGameData = `Nomor ${data.name}`;
            titleCardHeader = `Pilih Nominal`;
            break;
        default:
            labelGameData = "User ID";
            titleCardHeader = `Pilih Denom`;
            break;
    }

    return { labelGameData, titleCardHeader };
};
