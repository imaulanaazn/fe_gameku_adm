import { DiscountType } from "@/enum";

export interface IPromotion {
    id: string;
    code: string;
    gameId: string;
    name: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchase: number;
    maxDiscount: number;
    stock: number;
    description: string;
    startAt: string;
    endAt: string;
    deleted: boolean;

    used: number;
    remain: number;
}

export interface IPromotionPagination extends IPagination {
    data: IPromotion[];
}

export interface IPromotionPaginationWithSearch extends IPromotionPagination {
    keySearch: string;
}
