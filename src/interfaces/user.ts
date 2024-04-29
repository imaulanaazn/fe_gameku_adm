interface IUser {
  id: string;
  email: string;
  mobileNumber: string;
  name: string;
  image: string;
  roleId: string;
  isActive: boolean;
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
  balance?: number;
}

interface IUserPagination extends IPagination {
  data: IUser[];
}

interface IUserPaginationWithSearch extends IUserPagination {
  keySearch: string;
}
