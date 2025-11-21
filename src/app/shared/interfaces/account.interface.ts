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

export interface StatsService {
  serviceId: string,
  serviceName: string,
  totalAmount: number,
  percentage: number
}

export interface StatsOperation {
  month: number,
  totalAmount: number,
  totalCommission: number
}
