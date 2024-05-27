interface IPaymentDetail {
  desktopWebCheckoutUrl: string | null;
  mobileWebCheckoutUrl: string | null;
  mobileDeeplinkCheckoutUrl: string;
  qrCheckoutString: string;
  qrString: string;
  prefix: string;
  paymentCode: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  merchantCode: string;
  mobileNumber: string;
}

// interface IInvoice {
//     id: string;
//     invoiceId: string;
//     game: string;
//     paymentMethod: string;
//     paymentMethodId: string;
//     productName: string;
//     totalAmt: number;
//     feeAmt: number;
//     discAmt: number;
//     promoCd: string;
//     status: string;
//     amt: number;
//     quantity: number;
//     logoGame: string;
//     logoPaymentMethod: string;
//     payment: IPaymentDetail;
//     expiredAt: string | Date;
//     category: string;
//     createdAt: string | Date;
//     cd: string;
//     cashtag: string;
//     type: string;

//     paymentMethods?: IPaymentMethod;
//     detail?: IOrderDetail;
// }

interface Order {
  invoiceId: string;
  totalAmt: number;
  feeAmt: number;
  discAmt: number;
  promoCd: string;
  status: string;
  userId: string;
  serverId: string;
  amount: number;
  quantity: number;
  username: string | null;
  createdAt: string;
}

interface CheckoutUrlAction {
  checkoutUrl: string;
}

interface QrStringAction {
  qrString: string;
}

interface PaymentCodeAction {
  paymentCode: string;
}

interface MobileNumberAction {
  mobileNumber: string;
}

interface CashTagAction {
  cashtag: string;
}

interface EmptyAction {}

type Action =
  | CheckoutUrlAction
  | QrStringAction
  | PaymentCodeAction
  | EmptyAction
  | CashTagAction
  | MobileNumberAction;

interface Payment {
  name: string;
  cd: string;
  logo: string;
  paymentGuide: string | null;
  action: Action;
  expiredAt: string;
}

interface Product {
  name: string;
  logoDenom: string;
}

interface Game {
  name: string;
  logoUrl: string;
}

interface IInvoice {
  order: Order;
  payment: Payment;
  product: Product;
  game: Game;
}
