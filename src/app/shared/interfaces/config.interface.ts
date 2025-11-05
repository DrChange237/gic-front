export interface ToastOptions {
  timeOut: number;
  closeButton: boolean;
  progressBar: boolean;
}

export interface CountryZone {
  id: string;
  code: string;
  name: string;
}


export interface CountryCurrency {
  id: string;
  code: string;
  name: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  codeTel: number;
  flag: string;
  currency: CountryCurrency;
  zone: CountryZone;
}

export interface Town {
  id: string;
  name: string;
  code: string;
  country: Country;
}
