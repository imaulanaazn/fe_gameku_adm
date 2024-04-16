interface IproductCategory {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IProductCategoryWithDenoms  extends IproductCategory {
    denoms : IProductsGame[]
}

interface IProductCategoryPagination extends IPagination {
    data: IproductCategory[];
}

interface IProductCategoryPaginationWithSearch extends IProductCategoryPagination {
    keySearch: string;
}
