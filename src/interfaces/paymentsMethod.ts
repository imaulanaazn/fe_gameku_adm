interface IPaymentMethod {
  providerCd: string;
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: string;
  cd: string;
  category: string;
  isSingleUse: number;
  isActive: number;
  durationExpired: number;
  durationCd: string;
  logo: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface IPaymentMethodPagination extends IPagination {
  data: IPaymentMethod[];
}

interface IPaymentMethodPaginationWithSearch extends IPaymentMethodPagination {
  keySearch: string;
}
