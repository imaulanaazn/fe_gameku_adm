import { DiscountType } from "@/enum";

interface IPromotion {
    name: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchase: number;
    description: string;
    publishAt: Date;
    startAt: Date;
    endAt: Date;
    deleted: boolean;
}
