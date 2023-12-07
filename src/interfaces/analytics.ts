interface ICountAnalytics {
    totalOrders30daysAgo: number;
    totalOrders60daysAgo: number;
}

interface IDataAnalythicsChartLine {
    [key: string]: any;
    date: string;
    totalOrders: number;
    pending: number;
    paid: number;
    expired: number;
    failed: number;
    totalCustomers: number;
}

interface IResponseApiAnalytics extends ICountAnalytics {
    data: IDataAnalythicsChartLine[];
}
