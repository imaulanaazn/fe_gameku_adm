import { DiscountType } from "@/enum";

export interface IPromotion {
    id: string;
    code: string;
    gameId: string;
    name: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchase: number;
    description: string;
    startAt: Date;
    endAt: Date;
    deleted: boolean;
}

export interface IPromotionPagination extends IPagination {
    data: IPromotion[];
}

export interface IPromotionPaginationWithSearch extends IPromotionPagination {
    keySearch: string;
}
