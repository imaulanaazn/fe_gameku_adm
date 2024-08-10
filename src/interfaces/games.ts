interface GameCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

interface IGame {
  id: string;
  provider: string;
  categoryId: string;
  name: string;
  cd: string;
  automatically: boolean;
  type: string;
  voucherType: string;
  needCheckId: boolean;
  needServerId: boolean;
  typeServerId: string;
  logoUrl: string;
  isPopular: boolean;
  popSequence?: number;
  slug: string;
  description: string;
  logoDenom: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deleted: boolean;
  gameCategory: GameCategory;
  categoryName?: string;
  keywords?: string;
  listServer?: IServer[];
}

interface ListGameProps {
  title: string;
  data: IGame[];
}

interface IGameDetail extends IGame {
  products: IProductsGame[];
  servers?: IServer[];
  isGrouped: boolean;
  groupedDenoms: IProductCategoryWithDenoms[];
}

interface IGamePagination extends IPagination {
  data: IGame[];
}

interface IGamePaginationWithSearch extends IGamePagination {
  keySearch: string;
}
