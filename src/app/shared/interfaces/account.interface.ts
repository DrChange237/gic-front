export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface AccountBalance {
  title: string;
  balance: number;
  currency: Currency;
}